from django.db import models
from django.conf import settings # Required for MEDIA_ROOT
from PIL import Image
from ckeditor.fields import RichTextField
import os

# Common image processing logic could be put into a Mixin or a utility function
# For now, applying the refined logic directly to each model's save method as per original structure.

class Astrax(models.Model):
    name = models.CharField(default="", max_length=50, unique=True)
    image = models.ImageField(default="default.jpg", upload_to="images/Astrax")
    description = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) # Save the model and the original uploaded file first

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            original_uploaded_full_path = self.image.path
            original_uploaded_relative_name = self.image.name

            try:
                img = Image.open(original_uploaded_full_path)
                
                # Resize (thumbnail)
                output_size = (720, 1080)
                img.thumbnail(output_size)

                # Determine new .webp name and full path
                base_rel_name, _ = os.path.splitext(original_uploaded_relative_name)
                webp_relative_name = base_rel_name + '.webp'
                webp_full_path = os.path.join(settings.MEDIA_ROOT, webp_relative_name)

                # Ensure directory for webp_full_path exists
                os.makedirs(os.path.dirname(webp_full_path), exist_ok=True)

                # Save processed image as .webp
                img.save(webp_full_path, 'webp', optimize=True, quality=90)

                # Update image field name in memory if it changed
                name_updated = False
                if self.image.name != webp_relative_name:
                    self.image.name = webp_relative_name
                    name_updated = True

                # Delete the original uploaded file if it's different from the new .webp file
                if original_uploaded_full_path != webp_full_path and os.path.exists(original_uploaded_full_path):
                    os.remove(original_uploaded_full_path)
                
                # If the image name was updated (e.g., from .jpg to .webp), save this change
                if name_updated:
                    super().save(update_fields=['image'])

            except FileNotFoundError:
                print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for {self.name}.")
            except Exception as e:
                print(f"Error processing image for {self.name} ({original_uploaded_full_path}): {e}")


class Pleiades(models.Model):
    name = models.CharField(default="", max_length=50, unique=True)
    image = models.ImageField(default="default.jpg", upload_to="images/Pleiades")
    description = RichTextField(blank=True, null=True)
    problem_statement = models.URLField(default="", blank=True, null=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            original_uploaded_full_path = self.image.path
            original_uploaded_relative_name = self.image.name

            try:
                img = Image.open(original_uploaded_full_path)
                output_size = (720, 1080)
                img.thumbnail(output_size)

                base_rel_name, _ = os.path.splitext(original_uploaded_relative_name)
                webp_relative_name = base_rel_name + '.webp'
                webp_full_path = os.path.join(settings.MEDIA_ROOT, webp_relative_name)

                os.makedirs(os.path.dirname(webp_full_path), exist_ok=True)
                img.save(webp_full_path, 'webp', optimize=True, quality=90)

                name_updated = False
                if self.image.name != webp_relative_name:
                    self.image.name = webp_relative_name
                    name_updated = True
                
                if original_uploaded_full_path != webp_full_path and os.path.exists(original_uploaded_full_path):
                    os.remove(original_uploaded_full_path)
                
                if name_updated:
                    super().save(update_fields=['image'])

            except FileNotFoundError:
                print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for {self.name}.")
            except Exception as e:
                print(f"Error processing image for {self.name} ({original_uploaded_full_path}): {e}")


class Zenith(models.Model):
    name = models.CharField(default="", max_length=50, unique=True)
    image = models.ImageField(default="default.jpg", upload_to="images/Zenith")
    description = RichTextField(blank=True, null=True)
    problem_statement = models.URLField(default="", blank=True, null=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            original_uploaded_full_path = self.image.path
            original_uploaded_relative_name = self.image.name

            try:
                img = Image.open(original_uploaded_full_path)
                output_size = (720, 1080)
                img.thumbnail(output_size)

                base_rel_name, _ = os.path.splitext(original_uploaded_relative_name)
                webp_relative_name = base_rel_name + '.webp'
                webp_full_path = os.path.join(settings.MEDIA_ROOT, webp_relative_name)

                os.makedirs(os.path.dirname(webp_full_path), exist_ok=True)
                img.save(webp_full_path, 'webp', optimize=True, quality=90)

                name_updated = False
                if self.image.name != webp_relative_name:
                    self.image.name = webp_relative_name
                    name_updated = True

                if original_uploaded_full_path != webp_full_path and os.path.exists(original_uploaded_full_path):
                    os.remove(original_uploaded_full_path)

                if name_updated:
                    super().save(update_fields=['image'])
            
            except FileNotFoundError:
                print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for {self.name}.")
            except Exception as e:
                print(f"Error processing image for {self.name} ({original_uploaded_full_path}): {e}")


class Utkarsh(models.Model):
    name = models.CharField(default="", max_length=50, unique=True)
    image = models.ImageField(default="default.jpg", upload_to="images/Utkarsh")
    description = RichTextField(blank=True, null=True)
    problem_statement = models.URLField(default="", blank=True, null=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image and hasattr(self.image, 'path') and self.image.path and os.path.exists(self.image.path):
            original_uploaded_full_path = self.image.path
            original_uploaded_relative_name = self.image.name

            try:
                img = Image.open(original_uploaded_full_path)
                output_size = (720, 1080)
                img.thumbnail(output_size)

                base_rel_name, _ = os.path.splitext(original_uploaded_relative_name)
                webp_relative_name = base_rel_name + '.webp'
                webp_full_path = os.path.join(settings.MEDIA_ROOT, webp_relative_name)

                os.makedirs(os.path.dirname(webp_full_path), exist_ok=True)
                img.save(webp_full_path, 'webp', optimize=True, quality=90)

                name_updated = False
                if self.image.name != webp_relative_name:
                    self.image.name = webp_relative_name
                    name_updated = True
                
                if original_uploaded_full_path != webp_full_path and os.path.exists(original_uploaded_full_path):
                    os.remove(original_uploaded_full_path)

                if name_updated:
                    super().save(update_fields=['image'])

            except FileNotFoundError:
                print(f"Warning: File not found at {original_uploaded_full_path} during post-save processing for {self.name}.")
            except Exception as e:
                print(f"Error processing image for {self.name} ({original_uploaded_full_path}): {e}")