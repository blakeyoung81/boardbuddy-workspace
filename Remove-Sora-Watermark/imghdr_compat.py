"""
Compatibility shim for imghdr module (removed in Python 3.13).
This provides a minimal implementation for the sorawm package.
"""
import sys

if sys.version_info >= (3, 13):
    # Python 3.13+ - provide a compatibility shim
    class imghdr:
        @staticmethod
        def what(file, h=None):
            """Minimal implementation - returns None for most cases."""
            # This is a basic fallback - the actual implementation would need
            # to check file headers, but for watermark removal this might not be critical
            return None
    
    sys.modules['imghdr'] = imghdr
else:
    # Python < 3.13 - use standard library
    import imghdr




