from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler that ensures all API exceptions
    return properly formatted JSON responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # If it's already handled, return it
    if response is not None:
        return response
    
    # Otherwise, return a JSON response for any unhandled exceptions
    return Response(
        {"status": "error", "message": str(exc)},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    ) 