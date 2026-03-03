export class MdlUser {
    public usuario: String = "";
    public pass: String = "";
    public Activotoken: String = "";

    get_USUARIO(): String {
        return this.usuario;
    }

    set_Usuario(value: String) {
        this.usuario = value;
    }

    get_PASSS(): String {
        return this.pass;
    }

    set_PASSS(value: String) {
        this.pass = value;
    }

    get_tokken(): String {
        return this.Activotoken;
    }

    set_tokken(value: String) {
        this.Activotoken = value;
    }
}