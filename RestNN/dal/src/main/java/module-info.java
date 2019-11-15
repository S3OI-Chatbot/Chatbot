module dal {
    requires domain;
    requires spring.data.commons;
    requires spring.context;
    requires spring.data.rest.core;
    requires spring.beans;

    exports com.Se3OI.dal.services;
}