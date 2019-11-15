module logic {
    requires spring.context;
    requires dal;
    requires lombok;
    requires spring.beans;
    requires domain;

    exports com.Se3OI.logic.handlers;
    exports com.Se3OI.logic.components;

}