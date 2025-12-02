from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import AbstractUser, User
from django.conf import settings

from django.db import models
from django.contrib.auth.models import User

from rest_framework.authentication import TokenAuthentication

class BearerTokenAuthentication(TokenAuthentication):
    keyword = "Bearer"


class Administradores(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, default=None) #aquí jalamos los datos de user
    clave_admin = models.CharField(max_length=255,null=True, blank=True) 
    telefono = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255,null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    ocupacion = models.CharField(max_length=255,null=True, blank=True)
    #para creación y actualización:
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Perfil del admin "+self.user.first_name+" "+self.user.last_name

# TODO: Agregar perfiles para estudiantes y profesores

####################################################################################################
####################################################################################################

class Alumnos(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, default=None)
    #aquí van los datos que faltan
    matricula = models.CharField(max_length=255,null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True) 
    curp = models.CharField(max_length=255,null=True, blank=True)
    rfc = models.CharField(max_length=255,null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    ocupacion = models.CharField(max_length=255,null=True, blank=True)
    #para creación y actualización:
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Perfil del alumno "+self.user.first_name+" "+self.user.last_name
    
####################################################################################################
####################################################################################################

class Maestros(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, default=None)
    #aquí van los datos que faltan
    id_trabajador = models.CharField(max_length=255,null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.CharField(max_length=255, null=True, blank=True)
    rfc = models.CharField(max_length=255,null=True, blank=True)
    cubiculo = models.CharField(max_length=255, null=True, blank=True)
    area_investigacion = models.CharField(max_length=255, null=True, blank=True)
    materias_json = models.JSONField(null=True, blank=True)
    #para creación y actualización:
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Perfil del maestro "+self.user.first_name+" "+self.user.last_name

####################################################################################################
####################################################################################################
class Materias(models.Model):
    id = models.BigAutoField(primary_key=True)
    nrc = models.IntegerField(null=True, blank=True)
    nombre_materia = models.CharField(max_length=255, null=True, blank=True)
    seccion = models.IntegerField(null=True, blank=True)
    dias_json = models.JSONField(null=True, blank=True)
    hora_inicial = models.CharField(max_length=255, null=True, blank=True)  
    hora_final = models.CharField(max_length=255, null=True, blank=True) 
    salon = models.CharField(max_length=255, null=True, blank=True)
    programa_educativo = models.CharField(max_length=255,null=True, blank=True)
    profesor = models.CharField(max_length=255, null=True, blank=True)
    creditos = models.IntegerField(null=True, blank=True)
    #para creación y actualización:
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Perfil de la materia "+self.nombre_materia