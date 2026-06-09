# Estructura del Proyecto - AuraTab

Consulte la [estructura detallada en inglés](../en/STRUCTURE.md) para una descripción completa de la organización del proyecto.

## Descripción general

```
AuraTab/
├── manifest.json              # Configuración Manifest V3
├── background.js              # Service Worker
├── newtab.html                # Interfaz nueva pestaña
├── newtab.js                  # Lógica nueva pestaña
├── settings.html              # Página de configuración
├── settings.js                # Lógica configuración
├── i18n.js                    # Sistema de traducción
├── translations.json          # Diccionario (5 idiomas)
│
├── docs/                      # Documentación por idioma
├── images/                    # Iconos de extensión
└── wallpapers/                # Carpeta de fondos de pantalla
```

## Componentes principales

- **background.js** → Manejo de eventos y almacenamiento
- **newtab.js** → Lógica principal (AuraTabManager)
- **settings.js** → Gestión de preferencias
- **i18n.js** → Sistema de traducción
- **translations.json** → Diccionario multilingüe

---

Para más detalles, consulte el [README detallado](README.md).

**Versión**: 1.0.0
