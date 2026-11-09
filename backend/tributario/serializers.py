from rest_framework import serializers
from .models import CalificacionTributaria
from django.contrib.auth.models import User

class SerializerCalificacion(serializers.Serializer):

    ejercicio = serializers.IntegerField(required = True, help_text="Año o ejercicio tributario")
    instrumento = serializers.CharField(required= True, max_length=100, help_text="Nombre o codigo de ingreso")
    secuencia_evento = serializers.IntegerField(required= True, help_text="Numero de secuencia del evento")

    
    def validate_ejercicio(self, value):
        if not (2000 <= value <= 2026):
            raise serializers.ValidationError("El año del ejercicio debe estar entre 2000 y 2026")
        return value

    def validate_instrumento(self, name):
        if not name.strip():
            raise serializers.ValidationError("No puedes dejar espacios en blanco")
        name_corregido = name.strip().lower()
        return name_corregido

    def validate(self, data):

        ejercicio = data.get('ejercicio')
        instrumento = data.get('instrumento')
        secuencia_evento = data.get('secuencia_evento')
        nuevo_factor = data.get('factor', 0.0)

        duplicado = CalificacionTributaria.objects(
            ejercicio = ejercicio,
            instrumento = instrumento,
            secuencia_evento = secuencia_evento
        ).first()

        if duplicado:
            raise serializers.ValidationError(
                "Ya existe una calificacion tributaria para este ejercicio, instrumento y secuencia."
            )
        # 2. Validar suma acumulada de factores para este instrumento y ejercicio
        # Buscamos todos los registros previos con el mismo instrumento y ejercicio
        registros_existentes = CalificacionTributaria.objects(
            ejercicio=ejercicio,
            instrumento=instrumento
        )

        # Sumamos los factores que ya están guardados en la base de datos
        suma_actual = sum([reg.factor for reg in registros_existentes])

        # Sumamos el factor que el usuario quiere ingresar ahora
        suma_total = suma_actual + nuevo_factor

        # Validamos que no supere el 100% (1.0)
        if suma_total > 1.0:
            raise serializers.ValidationError(
                f"La suma total de los factores para este instrumento y ejercicio no puede superar el 100% (1.0). "
                f"Acumulado actual: {suma_actual}, intentando agregar: {nuevo_factor}."
            )
        
        return data

    def create(self, validated_data):

        return CalificacionTributaria(**validated_data).save()

    def update(self, instance, validated_data):

        instance.ejercicio = validated_data.get('ejercicio', instance.ejercicio)
        instance.instrumento = validated_data.get('instrumento', instance.instrumento)
        instance.secuencia_evento = validated_data.get('secuencia_evento', instance.secuencia_evento)
        instance.factor = validated_data.get('factor', instance.factor)

        instance.save()
        return instance

class AdminUserSerializer(serializers.ModelSerializer):
    # La contraseña es de solo escritura por seguridad (nunca se devuelve en las respuestas JSON)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'password', 'groups']

    def create(self, validated_data):
        # Extraemos la contraseña si viene en los datos
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Cifra la contraseña correctamente
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Actualiza el cifrado si cambió la contraseña
        instance.save()
        return instance
    



