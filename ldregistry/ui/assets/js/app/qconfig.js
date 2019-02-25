      // configuration
      var config = {
        endpoints: {
          "default": "/registry/system/query",
        },
        prefixes: {
          "rdf":      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          "rdfs":     "http://www.w3.org/2000/01/rdf-schema#",
          "owl":      "http://www.w3.org/2002/07/owl#",
          "xsd":      "http://www.w3.org/2001/XMLSchema#",

          "dct":  "http://purl.org/dc/terms/",
          "foaf": "http://xmlns.com/foaf/0.1/",
          "skos": "http://www.w3.org/2004/02/skos/core#",
          "version":  "http://purl.org/linked-data/version#",
          "ldp":  "http://www.w3.org/ns/ldp#",
          "time": "http://www.w3.org/2006/time#",
          "reg":  "http://purl.org/linked-data/registry#",
          "ui":   "http://purl.org/linked-data/registry-ui#",
          "qb":   "http://purl.org/linked-data/cube#",
          "org":  "http://www.w3.org/ns/org#"
        },
        queries: [
          { "name": "List all registers",
            "query": "select *\nwhere {\n" +
                     "  ?register a reg:Register; version:currentVersion ?regVer.\n}"
          } ,
          { "name": "List items in a register",
            "query": "select *\nwhere {\n" +
                     "  ?item reg:register <${registry.baseURI}/system/prefixes>;\n" + 
                     "        version:currentVersion ?itemVer.\n}"
          }
        ]
        };

      $(function(){qonsole.init( config );});
      