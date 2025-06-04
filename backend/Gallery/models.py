from django.db import models
from django.conf import settings # Import settings
from PIL import Image
from ckeditor.fields import RichTextField # Ensure ckeditor is configured
import os

# photogallery
class PhotoGallery(models.Model):
    name = models.CharField(default="", max_length=50, unique=True)
    image = models.ImageField(default="default.jpg", upload_to="images/photogallery")
    description = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        original_image_name_before_save = None
        if not is_new:
            try:
                old_instance = PhotoGallery.objects.get(pk=self.pk)
                if old_instance.image != self.image:
                    original_image_name_before_save = old_instance.image.name
            except PhotoGallery.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        image_processed_and_name_changed = False
        new_image_path_to_keep = None

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            # Avoid re-processing if the image is already a .webp or if default.jpg and not changed
            if not self.image.name.endswith('.webp') or original_image_name_before_save:
                original_uploaded_full_path = self.image.path
                original_uploaded_relative_name = self.image.name

                try:
                    img = Image.open(original_uploaded_full_path)
                    output_size = (720, 1080)
                    img.thumbnail(output_size)

                    base_rel_name, ext = os.path.splitext(original_uploaded_relative_name)
                    # Ensure default.jpg processing also results in default.webp if that's the intention
                    if original_uploaded_relative_name == "default.jpg" and ext == ".jpg":
                         webp_relative_name = "default.webp"
                    else:
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
                       original_uploaded_full_path != os.path.join(settings.MEDIA_ROOT, "default.jpg"): # Be cautious with default.jpg
                        os.remove(original_uploaded_full_path)

                except FileNotFoundError:
                    print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for Photo {self.name}.")
                except Exception as e:
                    print(f"Error processing image for Photo {self.name} ({original_uploaded_full_path}): {e}")
        
        if image_processed_and_name_changed:
            super().save(update_fields=['image'])
        
        if original_image_name_before_save and \
           original_image_name_before_save != self.image.name and \
           original_image_name_before_save != "default.jpg" and \
           original_image_name_before_save != "default.webp": # don't delete original default
            old_image_full_path = os.path.join(settings.MEDIA_ROOT, original_image_name_before_save)
            if os.path.exists(old_image_full_path) and old_image_full_path != new_image_path_to_keep:
                try:
                    os.remove(old_image_full_path)
                except Exception as e:
                    print(f"Error deleting old photo gallery image {old_image_full_path}: {e}")

# videogallery
class VideoGallery(models.Model):
    videoname = models.CharField(default="", max_length=50, unique=True)
    link = models.URLField(default="#/", blank=True, null=False) # Should this be nullable or have a more specific default?
    description = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.videoname