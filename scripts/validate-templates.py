import glob
import mmap
import re
import sys
import getopt

class Property:
    def __init__(self, name):
        self.name = name
        self.isUsed = False
    def __repr__(self):
        return "Property({}, {}, {})".format(self.name, self.isUsed)

properties = {}
undefined_properties = {}

def remove_prefix(text, prefix):
    return text[text.startswith(prefix) and len(prefix):]

def ensure_last_slash(str):
    return str if (str.endswith("/")) else str + "/"

def read_properties(file_path):
    with open(file_path, 'r+') as fi:
        for i, line in enumerate(fi):
            if line.isspace(): continue
            split = line.split("=", 1)
            name = split[0]
            properties[name] = Property(name)

def report_property(template_name, prop):
    if prop in properties:
        properties[prop].isUsed = True
    else:
        if prop in undefined_properties:
            undefined_properties[prop].append(template_name)
        else:
            undefined_properties[prop] = [template_name]

def find_simple_props(template_name, data):
    simpleProps = re.findall(r"\$msg\[[\"'](\w+(\.\w+)+)[\"']\]", data)
    for foundProp in simpleProps:
        report_property(template_name, foundProp[0])

def find_complex_props(template_name, data):
    complexProps = re.findall(r"\$msg\.get\([\"']([^,'\"]+)[\"'](,[^\)]+)*\)", data)
    for foundProp in complexProps:
        report_property(template_name, foundProp[0])

def read_templates(src_dir_path):
    src_dir_path = ensure_last_slash(src_dir_path)
    templates = glob.glob(pathname = "{}/**/*.vm".format(src_dir_path), recursive = True)
    for template in templates:
        template_name = remove_prefix(template, src_dir_path)
        with open(template, 'r+') as fi:
            data = mmap.mmap(fi.fileno(), 0).read().decode('utf-8')
            find_simple_props(template_name, data)
            find_complex_props(template_name, data)

def print_unused_props():
    if all(prop.isUsed for prop in properties.values()): 
        print("No unused properties found.")
    else:
        print("Unused props:")
        for prop in properties:
            if not properties[prop].isUsed:
                print("     Unused property \"{}\"".format(prop))

def print_undefined_props():
    if len(undefined_properties) == 0: 
        print("No undefined properties found.")
    else:
        print("Undefined props:")
        for prop in undefined_properties:
            print("     Undefined property \"{}\" found in: [{}]".format(prop, ",".join(undefined_properties[prop])))

def process_args(argv):
    language_props_file = ''
    template_root_dir = ''
    try:
        opts, args = getopt.getopt(argv,"hl:t:",["lang_props=","template_root="])
    except getopt.GetoptError:
        print("validate-templates.py -l <language_props_file> -t <template_root_directory>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print("validate-templates.py -l <language_props_file> -t <template_root_directory>")
            sys.exit()
        elif opt in ("-l", "--lang_props"):
            language_props_file = arg
        elif opt in ("-t", "--template_root"):
            template_root_dir = arg
    print("Parameters:")
    if not language_props_file:
        print("     language properties file (-l | --lang_props) is not supplied;")
        print("         defaulting to \"/opt/ldregistry/config/language/messages/en.properties\"")
        language_props_file = "/opt/ldregistry/config/language/messages/en.properties"
    else:
        print("     language properties file (-l | --lang_props) set to {}".format(language_props_file))
    if not template_root_dir:
        print("     template root directory (-t | --template_root) is not supplied;")
        print("         defaulting to \"/opt/ldregistry/templates\"")
        template_root_dir = "/opt/ldregistry/templates"
    else:
        print("     template root directory (-t | --template_root) set to {}".format(template_root_dir))
    print()
    return (language_props_file, template_root_dir)

def main(argv):
    (language_props_file, template_root_dir) = process_args(argv)

    read_properties(language_props_file)
    read_templates(template_root_dir)

    print_unused_props()
    print_undefined_props()


if __name__ == "__main__": main(sys.argv[1:])
