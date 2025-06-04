from django.db import models
from django.conf import settings # Import settings
from PIL import Image
import os

class MemberDetail(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    message = models.CharField(max_length=100) # Consider RichTextField or TextField for longer messages

    POSITIONS = (
        ('A', 'Coordinator'),
        ('B', 'Co-coordinator'),
        ('C', 'Core Team'),
        ('D', 'Mentor'),
    )
    position = models.CharField(max_length=1, choices=POSITIONS, default='C')
    linkedin_url  = models.CharField(max_length=100) # Consider URLField
    instagram_url = models.CharField(max_length=100) # Consider URLField
    image = models.ImageField(default="default.webp", upload_to="images/CoreTeam")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        original_image_name_before_save = None
        if not is_new:
            try:
                old_instance = MemberDetail.objects.get(pk=self.pk)
                if old_instance.image != self.image:
                    original_image_name_before_save = old_instance.image.name
            except MemberDetail.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        image_processed_and_name_changed = False
        new_image_path_to_keep = None

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            if not self.image.name.endswith('.webp') or original_image_name_before_save:
                original_uploaded_full_path = self.image.path
                original_uploaded_relative_name = self.image.name

                try:
                    img = Image.open(original_uploaded_full_path)
                    output_size = (720, 1080)
                    img.thumbnail(output_size)

                    base_rel_name, _ = os.path.splitext(original_uploaded_relative_name)
                    webp_relative_name = base_rel_name + '.webp'
                    webp_full_path = os.path.join(settings.MEDIA_ROOT, webp_relative_name)
                    new_image_path_to_keep = webp_full_path

                    os.makedirs(os.path.dirname(webp_full_path), exist_ok=True)
                    img.save(webp_full_path, 'webp', optimize=True, quality=90)

                    if self.image.name != webp_relative_name:
                        self.image.name = webp_relative_name
                        image_processed_and_name_changed = True
                    
                    if original_uploaded_full_path != webp_full_path and \
                       os.path.exists(original_uploaded_full_path) and \
                       not original_uploaded_full_path.endswith('default.webp'):
                        os.remove(original_uploaded_full_path)

                except FileNotFoundError:
                    print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for Member {self.name}.")
                except Exception as e:
                    print(f"Error processing image for Member {self.name} ({original_uploaded_full_path}): {e}")
        
        if image_processed_and_name_changed:
            super().save(update_fields=['image'])

        if original_image_name_before_save and \
           original_image_name_before_save != self.image.name and \
           original_image_name_before_save != "default.webp":
            old_image_full_path = os.path.join(settings.MEDIA_ROOT, original_image_name_before_save)
            if os.path.exists(old_image_full_path) and old_image_full_path != new_image_path_to_keep:
                try:
                    os.remove(old_image_full_path)
                except Exception as e:
                    print(f"Error deleting old member image {old_image_full_path}: {e}")