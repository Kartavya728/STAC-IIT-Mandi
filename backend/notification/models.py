# notification/models.py
from django.db import models
from django.utils import timezone # For default timestamp if you prefer more control

class Notification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField() # Consider using RichTextField if you need HTML content
    link = models.URLField(max_length=200, blank=True, null=True) # Optional link
    is_active = models.BooleanField(default=True) # To control visibility/pop-up behavior
    timestamp = models.DateTimeField(auto_now_add=True) # Automatically set on creation
    # If you want to be able to update the timestamp or set it manually sometimes:
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    # effective_date = models.DateTimeField(default=timezone.now) # Example of a specific date

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-timestamp'] # Show newest notifications first by default