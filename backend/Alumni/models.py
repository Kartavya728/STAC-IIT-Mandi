from django.db import models
from django.conf import settings # Import settings
from PIL import Image
import os

class Alumni(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, default='email')
    message = models.CharField(max_length=100, default='andhera_kayam_rahe') # Consider RichTextField or TextField for longer messages
    linkedin_url  = models.CharField(max_length=100, default='linkedin') # Consider URLField
    instagram_url = models.CharField(max_length=100, default='instagram') # Consider URLField
    image = models.ImageField(default="default.webp", upload_to="images/Alumni") # Changed upload_to for clarity

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Store the original image name before the first save if it's a new instance
        # or if the image is being changed.
        is_new = self._state.adding
        original_image_name_before_save = None
        if not is_new:
            try:
                old_instance = Alumni.objects.get(pk=self.pk)
                if old_instance.image != self.image: # Image changed
                    original_image_name_before_save = old_instance.image.name
            except Alumni.DoesNotExist:
                pass # Should not happen if not is_new, but good to handle

        super().save(*args, **kwargs) # Save the model and the original uploaded file first

        image_processed_and_name_changed = False
        new_image_path_to_keep = None

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            # Avoid re-processing if the image is already a .webp from a previous save of this instance
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
                    
                    # Delete the original uploaded file if it's different from the new .webp file
                    # and it's not the default image trying to delete itself.
                    if original_uploaded_full_path != webp_full_path and \
                       os.path.exists(original_uploaded_full_path) and \
                       not original_uploaded_full_path.endswith('default.webp'): # Be cautious with default
                        os.remove(original_uploaded_full_path)
                    
                except FileNotFoundError:
                    print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for Alumni {self.name}.")
                except Exception as e:
                    print(f"Error processing image for Alumni {self.name} ({original_uploaded_full_path}): {e}")

        if image_processed_and_name_changed:
            super().save(update_fields=['image'])

        # Clean up old image file if image was changed and processed
        if original_image_name_before_save and \
           original_image_name_before_save != self.image.name and \
           original_image_name_before_save != "default.webp":
            old_image_full_path = os.path.join(settings.MEDIA_ROOT, original_image_name_before_save)
            if os.path.exists(old_image_full_path) and old_image_full_path != new_image_path_to_keep:
                try:
                    os.remove(old_image_full_path)
                except Exception as e:
                    print(f"Error deleting old alumni image {old_image_full_path}: {e}")