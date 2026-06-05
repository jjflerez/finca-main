import os
import re

models = {
    "Inmueble.java": "@Entity\n@Inheritance(strategy = InheritanceType.JOINED)\npublic abstract class Inmueble {",
    "Edificio.java": "@Entity\npublic class Edificio extends Inmueble {",
    "Piso.java": "@Entity\npublic class Piso extends Inmueble {",
    "Local.java": "@Entity\npublic class Local extends Inmueble {"
}

model_dir = r"src\main\java\com\fincas\gestion\model"

for file_name, class_replacement in models.items():
    path = os.path.join(model_dir, file_name)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add imports
    imports = "import jakarta.persistence.*;\n"
    if "jakarta.persistence" not in content:
        content = content.replace("package com.fincas.gestion.model;\n", "package com.fincas.gestion.model;\n\n" + imports)
    
    # Replace class declaration
    content = re.sub(r'public (abstract )?class ' + file_name.replace(".java", "") + r'( extends Inmueble)? \{', class_replacement, content)
    
    # Add @Id to id field in Inmueble
    if file_name == "Inmueble.java":
        content = content.replace("private String id;", "@Id\n    private String id;")
    
    # Remove references to Inquilino (since it's a different microservice now)
    if "private Inquilino inquilinoActual;" in content:
        content = content.replace("private Inquilino inquilinoActual;", "private String inquilinoId;")
        content = content.replace("public Inquilino getInquilinoActual()", "public String getInquilinoId()")
        content = content.replace("public void setInquilinoActual(Inquilino", "public void setInquilinoId(String")
        content = content.replace("this.inquilinoActual = inquilinoActual;", "this.inquilinoId = inquilinoId;")
        content = content.replace("inquilinoActual != null", "inquilinoId != null && !inquilinoId.isEmpty()")
        content = content.replace("this.inquilinoActual = null;", "this.inquilinoId = null;")
        content = re.sub(r'inquilinoActual\.getNombreCompleto\(\)', 'inquilinoId', content)
        
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Modelos actualizados a JPA")
