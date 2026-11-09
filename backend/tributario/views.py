from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SerializerCalificacion
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import NotFound
from .models import CalificacionTributaria
from django.contrib.auth import authenticate
from django.contrib.auth.models import User



class EsAdmin(BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.groups.filter(name='Admin').exists()

class LoginApiView(APIView):
    # Permitimos el acceso libre a esta vista, ya que el usuario aún no tiene token para loguearse
    permission_classes = [AllowAny]

    def post(self, request):
        # El cliente puede enviar 'usuario' y 'contraseña' en su JSON
        usuario_ingresado = request.data.get("usuario")
        contrasena_ingresada = request.data.get("contraseña")

        # CORREGIDO: authenticate espera 'username' y 'password' internamente
        user = authenticate(username=usuario_ingresado, password=contrasena_ingresada)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "mensaje": "Login exitoso",
                "token": token.key,
                "usuario": user.username # Atributo nativo de Django
            }, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Credenciales inválidas. Verifique su usuario y contraseña."},
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutApiView(APIView):
    # El usuario debe estar autenticado (enviar su token válido) para poder cerrar sesión
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Eliminamos el token asociado al usuario actual para invalidarlo
            request.user.auth_token.delete()
            
            return Response(
                {"mensaje": "Sesión cerrada exitosamente. Token invalidado."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "No se pudo cerrar la sesión. Intente nuevamente."},
                status=status.HTTP_400_BAD_REQUEST
            )

class AdminUserListCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, EsAdmin]

    def get(self, request):
        usuarios = User.objects.all()
        serializer = AdminUserSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AdminUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"mensaje": "Usuario creado", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated, EsAdmin]

    def put(self, request, id):
        try:
            usuario = User.objects.get(id=id)
            serializer = AdminUserSerializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"mensaje": "Usuario modificado", "data": serializer.data}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            raise NotFound("Usuario no encontrado")

    def delete(self, request, id):
        try:
            usuario = User.objects.get(id=id)
            usuario.delete()
            return Response({"mensaje": "Usuario eliminado"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            raise NotFound("Usuario no encontrado")


class CalificacionApiView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = SerializerCalificacion(data=request.data)

        if serializer.is_valid():

            serializer.save()
            return Response(
                {
                    "mensaje": "Calificacion tributaria registrada con exito",
                    "data" : serializer.data
                }, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DetalleCalificacionApiView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            registro = CalificacionTributaria.objects.get(id=id)
            serializer = SerializerCalificacion(registro)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 1. Corregido: La excepción la lanza el Modelo, no el Serializador
        except CalificacionTributaria.DoesNotExist:
            raise NotFound("No se encontró el registro con el ID proporcionado.")

    def put(self, request, id):
        try:
            registro = CalificacionTributaria.objects.get(id=id)
            
            # 2. Corregido: Le pasamos 'registro' como instance para que sepa que es una actualización
            serializer = SerializerCalificacion(registro, data=request.data)

            if serializer.is_valid():
                serializer.save() # Esto llamará al método update() de tu serializador
                return Response({
                    "mensaje": "Calificacion tributaria modificada",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except CalificacionTributaria.DoesNotExist:
            raise NotFound("No se encontro el registro con el ID proporcionado")

    def delete(self, request, id):
        try:
            registro = CalificacionTributaria.objects.get(id=id)
            registro.delete() # Borra directamente el documento en MongoDB
            return Response({
                'mensaje': 'Calificacion tributaria eliminada correctamente'
            }, status=status.HTTP_200_OK)
        
        except CalificacionTributaria.DoesNotExist:
            raise NotFound("No se encontro el registro con el ID proporcionado")



