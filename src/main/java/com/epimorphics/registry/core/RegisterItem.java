/******************************************************************
 * File:        RegisterItem.java
 * Created by:  Dave Reynolds
 * Created on:  23 Jan 2013
 *
 * (c) Copyright 2013, Epimorphics Limited
 *
 *****************************************************************/

package com.epimorphics.registry.core;

import java.util.Calendar;
import java.util.UUID;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.epimorphics.rdfutil.RDFUtil;
import com.epimorphics.registry.vocab.RegistryVocab;
import com.epimorphics.server.webapi.BaseEndpoint;
import com.epimorphics.vocabs.SKOS;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.sparql.util.Closure;
import com.hp.hpl.jena.util.ResourceUtils;
import com.hp.hpl.jena.vocabulary.DCTerms;
import com.hp.hpl.jena.vocabulary.RDF;
import com.hp.hpl.jena.vocabulary.RDFS;

/**
 * Abstraction for creation and access to the details of a register item plus its entity.
 *
 * The entity, if present, should be kept in a separate graph so that it can be stored
 * independently of the item without making any assumptions like CBD.
 *
 * @author <a href="mailto:dave@epimorphics.com">Dave Reynolds</a>
 */
public class RegisterItem extends Description {

    Resource entity;
    String notation;
    String parentURI;

    /**
     * Construct a new register item from a loaded description
     */
    public RegisterItem(Resource root) {
        super(root);
    }

    /**
     * Construct a register item from a description
     * @param root  the item resource in a model that can be modified
     * @param parentURI the URI of the target register in which the registration is taking place
     */
    private RegisterItem(Resource root, String parentURI) {
        super(root);
        this.parentURI = parentURI;
    }

    /**
     * Construct a register item from a description
     * @param root  the item resource in a model that can be modified
     * @param parentURI the URI of the target register in which the registration is taking place
     * @param notation the local name of the item within the parent register
     */
    private RegisterItem(Resource root, String parentURI, String notation) {
        super(root);
        this.parentURI = parentURI;
        this.notation = notation;
    }

    /**
     * Record the address of an associated entity.
     * Should be in a separate model to allowed to be saved on its own.
     * Does NOT create reg:definition/reg:entity links.
     */
    public void setEntity(Resource entity) {
        this.entity = entity;
    }

    public String getNotation() {
        if (notation == null) {
            determineLocation();
        }
        return notation;
    }

    public Resource getEntity() {
        return entity;
    }

    /**
     * Takes a register item resource from a request payload, determines and checks
     * the intended URI for both it and the entity, fills in blanks on the register item,
     * returns the constructed item representation.
     */
    public static RegisterItem fromRIRequest(Resource ri, String parentURI, boolean isNewSubmission) {
        Model d = Closure.closure(ri, false);
        Resource entity = findRequiredEntity(ri);
        entity = entity.inModel( Closure.closure(entity, false) );
        RegisterItem item = new RegisterItem( ri.inModel(d), parentURI );
        item.relocate();
        item.relocateEntity(entity);
        item.updateForEntity(isNewSubmission, Calendar.getInstance());
        return item;
    }

    /**
     * Constructs a RegisterIem for an entity in a request payload that doesn't have
     * any explict RegisterItem specification.
     */
    public static RegisterItem fromEntityRequest(Resource e, String parentURI, boolean isNewSubmission) {
        String notation = riNotationFromEntity(e, parentURI);
        String riURI = makeItemURI(parentURI, notation);
        Resource ri = ModelFactory.createDefaultModel().createResource(riURI)
                .addProperty(RDF.type, RegistryVocab.RegisterItem)
                .addProperty(RegistryVocab.notation, notation);
        RegisterItem item = new RegisterItem( ri, parentURI, notation );
        Resource entity = e;
        item.relocateEntity(entity);
        item.updateForEntity(isNewSubmission, Calendar.getInstance());
        return item;
    }

    /**
     * Set the status of the item
     */
    public Resource setStatus(String status) {
        for (Status s : Status.values()) {
            if (s.name().equalsIgnoreCase(status)) {
                return s.getResource();
            }
        }
        return null;
    }

    public Resource setStatus(Resource status) {
        root.removeAll(RegistryVocab.status);
        root.addProperty(RegistryVocab.status, status);
        return status;
    }

    // -----------  internal helpers for sorting out the different notation cases ---------------------------

    private void relocate() {
        String uri = makeItemURI(parentURI, notation);
        if ( ! uri.equals(root.getURI()) ) {
            ResourceUtils.renameResource(root, uri);
        }
        root = root.getModel().createResource(uri);
    }

    private void relocateEntity(Resource srcEntity) {
        String uri = entityURI(srcEntity);
        if ( ! uri.equals(srcEntity.getURI()) ) {
            ResourceUtils.renameResource(srcEntity, uri);
            entity = srcEntity.getModel().createResource(uri);
        } else {
            entity = srcEntity;
        }
    }

    /**
     * Update a register item to reflect the current state of the entity
     */
    public void updateForEntity(boolean isNewSubmission, Calendar time) {
        if (isNewSubmission) {
            root.addProperty(DCTerms.dateSubmitted, root.getModel().createTypedLiteral(time));
        } else {
            root.addProperty(DCTerms.modified, root.getModel().createTypedLiteral(time));
        }
        if ( !root.hasProperty(RegistryVocab.status) && isNewSubmission) {
            root.addProperty(RegistryVocab.status, RegistryVocab.statusSubmitted);
        }
        if (!root.hasProperty(RegistryVocab.notation)) {
            root.addProperty(RegistryVocab.notation, notation);
        }

        root.removeAll(RDFS.label)
            .removeAll(DCTerms.description)
            .removeAll(RegistryVocab.itemClass);
        if (entity.hasProperty(SKOS.prefLabel)) {
            RDFUtil.copyProperty(entity, root, SKOS.prefLabel, RDFS.label);
        } else if (entity.hasProperty(SKOS.altLabel)) {
            RDFUtil.copyProperty(entity, root, SKOS.altLabel, RDFS.label);
        } else {
            RDFUtil.copyProperty(entity, root, RDFS.label);
        }
        RDFUtil.copyProperty(entity, root, DCTerms.description);
        for (Statement s : entity.listProperties(RDF.type).toList()) {
            root.addProperty(RegistryVocab.itemClass, s.getObject());
        }
        // Omit entity reference link itself, this will be created per-version when added to store

        // TODO the reg:submitter may be set automatically to an identifier for the user making the submission
    }

    public String getEntityRefURI() {
        return root.getURI() + "#entityref";
    }

    private void determineLocation() {
        if (root.isURIResource()) {
            String uri = root.getURI();
            if (uri.equals(BaseEndpoint.DUMMY_BASE_URI)) {
                // Empty relative URI specified
                notation = getExplicitNotation(root);
            } else if (uri.startsWith(BaseEndpoint.DUMMY_BASE_URI)) {
                // relative URI
                notation = validateNotation( uri.substring(BaseEndpoint.DUMMY_BASE_URI.length() + 1));
            } else if (uri.startsWith(parentURI)) {
                notation = validateNotation( uri.substring(parentURI.length() + 1) );
            } else {
                // Register Item has explicit URI which is not relative to the target parent register
                throw new WebApplicationException(Response.Status.FORBIDDEN);
            }
        } else {
            notation = getExplicitNotation(root);
        }
        if (notation == null) {
            notation = UUID.randomUUID().toString();
        } else if (notation.contains("/")) {
            // TODO check pchar* syntax more fully
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
    }

    private static String getExplicitNotation(Resource root) {
        if (root.hasProperty(RegistryVocab.notation)) {
            String location = RDFUtil.getStringValue(root, RegistryVocab.notation);
            if (location.startsWith("_")) {
                throw new WebApplicationException(Response.Status.BAD_REQUEST);
            }
            return location;
        }
        return null;
    }

    private static String validateNotation(String notation) {
        if (notation.startsWith("_")) {
            return notation.substring(1);
        } else {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
    }

    private static String riNotationFromEntity(Resource entity, String parentURI) {
        String uri = entity.getURI();
        String notation = null;
        if (entity.isAnon() || uri.equals(BaseEndpoint.DUMMY_BASE_URI)) {
            notation = UUID.randomUUID().toString();
        } else if (uri.startsWith(BaseEndpoint.DUMMY_BASE_URI)) {
            // relative URI
            notation = uri.substring(BaseEndpoint.DUMMY_BASE_URI.length() + 1);
        } else if (uri.startsWith(parentURI)) {
            notation = uri.substring(parentURI.length() + 1);
        } else {
            // Absolute URI, just use it and create anotation for the item
            notation = UUID.randomUUID().toString();
        }
        return notation;
    }

    private String entityURI(Resource entity) {
        String uri = entity.getURI();
        if (entity.isAnon() || uri.equals(BaseEndpoint.DUMMY_BASE_URI)) {
            uri = makeEntityURI();
        } else if (uri.startsWith(BaseEndpoint.DUMMY_BASE_URI)) {
            // relative URI
            String eNotation = uri.substring(BaseEndpoint.DUMMY_BASE_URI.length() + 1);
            if (!eNotation.equals(notation)) {
                throw new WebApplicationException(Response.Status.BAD_REQUEST);
            }
            uri = makeEntityURI();
        } else if (uri.startsWith(parentURI)) {
            String eNotation = uri.substring(parentURI.length() + 1);
            if (!eNotation.equals(notation)) {
                throw new WebApplicationException(Response.Status.BAD_REQUEST);
            }
            uri = makeEntityURI();
        }
        return uri;
    }

    private String makeEntityURI() {
        return makeEntityURI(parentURI, notation);
    }

    private static String makeEntityURI(String parentURI, String notation) {
        return baseParentURI(parentURI) + "/" + notation;
    }

    private static String makeItemURI(String parentURI, String notation) {
        return baseParentURI(parentURI) + "/_" + notation;
    }

    private static String baseParentURI(String parentURI){
        if (parentURI.endsWith("/")) {
            return parentURI.substring(0, parentURI.length() - 1);
        } else {
            return parentURI;
        }
    }

    private static Resource findRequiredEntity(Resource ri) {
        Resource definition = ri.getPropertyResourceValue(RegistryVocab.definition);
        if (definition != null) {
            Resource entity = definition.getPropertyResourceValue(RegistryVocab.entity);
            if (entity != null){
                return entity;
            }
        }
        throw new WebApplicationException(Response.Status.BAD_REQUEST);
    }
}