from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField, datetime

class CalificacionTributaria(Document):
    ejercicio = IntField(required = True, help_text="Año o ejercicio tributario")
    instrumento = StringField(required= True, max_length=100, help_text="Nombre o codigo de ingreso")
    secuencia_evento = IntField(required= True, help_text="Numero de secuencia del evento")

    meta = {
        'collection' : 'calificaciones_tributarias',
        'indexes' : [
            {'fields': ('ejercicio', 'instrumento', 'secuencia_evento'), 'unique':True}
            ]
    }

    def __str__(self):
        return f"{self.instrumento} - {self.ejercicio} (Seq: {self.secuencia_evento})"

class CargaArchivo(Document):
    nombre_archivo = StringField(required=True, max_length=255)
    fecha_carga = DateTimeField(default=datetime.datetime.utcnow)
    estado = StringField(default="PENDIENTE", max_length=50)
    registros_procesados = IntField(default=0)

    meta = {'collection': 'cargar_archivos'}

    def __str__(self):
        return f"{self.nombre_archivo} - {self.fecha_carga}"

class RegistroLog(Document):
    carga = ReferenceField(CargaArchivo, reverse_delete_rule=2)
    tipo = StringField(required=True, max_length=20)
    mensaje = StringField(required=True)
    fecha = DateTimeField(default=datetime.datetime.utcnow)

    meta = {'collection': 'registros_logs'}

    def __str__(self):
        return f"[{self.tipo} {self.mensaje[:30]}]"
