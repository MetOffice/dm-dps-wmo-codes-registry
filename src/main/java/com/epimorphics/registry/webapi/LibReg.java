/******************************************************************
 * File:        LibReg.java
 * Created by:  Dave Reynolds
 * Created on:  31 Jan 2013
 *
 * (c) Copyright 2013, Epimorphics Limited
 *
 *****************************************************************/

package com.epimorphics.registry.webapi;

import java.util.ArrayList;
import java.util.List;

import com.epimorphics.rdfutil.ModelWrapper;
import com.epimorphics.rdfutil.RDFNodeWrapper;
import com.epimorphics.registry.core.Description;
import com.epimorphics.registry.core.Register;
import com.epimorphics.registry.core.Registry;
import com.epimorphics.registry.core.Status;
import com.epimorphics.registry.store.RegisterEntryInfo;
import com.epimorphics.registry.store.StoreAPI;
import com.epimorphics.registry.util.Prefixes;
import com.epimorphics.server.core.Service;
import com.epimorphics.server.core.ServiceBase;
import com.epimorphics.server.templates.LibPlugin;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

/**
 * Some supporting methods to help Velocity UI access the registry store.
 *
 * @author <a href="mailto:dave@epimorphics.com">Dave Reynolds</a>
 */
public class LibReg extends ServiceBase implements LibPlugin, Service {

    public StoreAPI getStore() {
        return Registry.get().getStore();
    }

    public RDFNodeWrapper getResource(String uri) {
        if ( ! uri.startsWith("http") ) {
            uri = Registry.get().getBaseURI() + uri;
        }
        Description d = getStore().getCurrentVersion(uri);
        if (d == null) {
            return null;
        }
        return wrapNode( d.getRoot() );
    }

    private ModelWrapper wrapModel(Model m) {
        m.setNsPrefixes( Prefixes.get() );
        return new ModelWrapper( m );
    }

    private RDFNodeWrapper wrapNode(Resource root) {
        return wrapModel( root.getModel() ).getNode(root);
    }

    public List<RegisterEntryInfo> listMembers(Object arg) {
        Register reg = null;;
        if (arg instanceof String) {
            reg = getStore().getCurrentVersion((String)arg).asRegister();
        } else if (arg instanceof RDFNodeWrapper) {
            reg = new Register( ((RDFNodeWrapper)arg).asResource() );
        } else if (arg instanceof Register) {
            reg = (Register) arg;
        } else {
            return null;
        }
        return getStore().listMembers(reg);
    }

    public Status asStatus(Object state) {
        if (state instanceof Status) {
            return (Status)state;
        } else if (state instanceof Resource) {
            return Status.forResource((Resource)state);
        } else if (state instanceof RDFNodeWrapper) {
            return Status.forResource(((RDFNodeWrapper)state).asResource());
        } else {
            return null;
        }
    }

    public List<Status> nextStates(RDFNodeWrapper state) {
        Status current = asStatus(state);
        if (current == null) return new ArrayList<Status>();
        List<Status> next = current.nextStates();
        next.remove(current);
        return next;
    }

}
