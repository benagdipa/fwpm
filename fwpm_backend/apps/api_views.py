from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint for the API"""
    return Response({'status': 'ok', 'message': 'API is running'}) 