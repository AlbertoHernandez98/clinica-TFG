export class Backend {
    backend =
    {
        "url": "http://localhost",
        "port": ":3000",
        "rutas": {
            "login": "/auth/login",
            "logut": "/auth/logout",
            "photo": "/photos/upload"
        }
    }

    // method(ruta: string) {
    //     const found = backend.rutas.find(element => element === ruta);

    //     console.log(found);
    // }

    // strigifyRouteLogin(ruta: string) {
    //     return backend.url + ":" + backend.port + "/" + backend.rutas[ruta];
    // }
}