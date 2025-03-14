import json
from django.http import JsonResponse

class JSONErrorMiddleware:
    """
    Middleware to ensure that all API errors are returned as JSON responses
    rather than HTML error pages.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Check if the path starts with /api/ and it's an error response
        if request.path.startswith('/api/') and 400 <= response.status_code < 600:
            # If it's an HTML response, convert it to JSON
            if 'text/html' in response.get('Content-Type', ''):
                return JsonResponse({
                    'status': 'error',
                    'message': f'Server error: {response.status_code}',
                    'code': response.status_code
                }, status=response.status_code)
        
        return response 