from django.db import models

# Create your models here.

class CalificacionTributaria(models.Model):
    ejercicio = models.IntegerField(help_text="Año o ejercicio tributario")
    instrumento = models.CharField(max_length=100, help_text="Nombre o codigo de ingreso")
    secuencia_evento = models.IntegerField(help_text="Numero de secuencia del evento")

    class Meta:
        unique_together = ('ejercicio','instrumento','secuencia_evento')

    def __str__(self):
        return f"{self.instrumento} - {self.ejercicio} (Seq: {self.secuencia_evento})"

class CargaArchivo(models.Model):
    nombre_archivo = models.CharField(max_length=255)
    fecha_carga = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default="PENDIENTE")
    registros_procesados = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nombre_archivo} - {self.fecha_carga}"

class RegistroLog(models.Model):
    carga = models.ForeignKey(CargaArchivo, on_delete=models.CASCADE, related_name="Logs")
    tipo = models.CharField(max_length=20)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.tipo} {self.mensaje[:30]}]"