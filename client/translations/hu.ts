export default {
    auth: {
        welcome: "Üdvözlünk újra",
        welcomeRegistration: "Üdvözlünk! Hozzon létre fiókot",
        login: "Bejelentkezés",
        registration: "Regisztráció",
        email: "E-mail-cím",
        password: "Jelszó",
        repassword: "Jelszó újra",
        noAccount: "Még nincs fiókja?",
        haveAccount: "Már van fiókja?",
        register: "Regisztráljon most",
        loginCTA: "Bejelentkezés",
        logout: "Kijelentkezés",
        passwordChange: "Jelszóváltoztatás"
    },
    forms: {
        password: "Írja be a jelszavát",
        repassword: "Írja be újra a jelszavát",
        email: "Írja be az e-mail címét",
        username: "Írja be a felhasználónevét",
    },
    tabs: {
        login: "Bejelentkezés",
        home: "Főoldal",
        settings: "Beállítások",
    },
    settings: {
        title: "Beállítások",
        appearance: "Általános beállítások",
        authenticated: {
            title: "Felhasználói beállítások",
            password: "Jelszóváltoztatás",
        },
        languages: {
            cta: "Nyelvi beállítások",
            hu: "Magyar",
            en: "Angol"
        },
        colortheme: {
            cta: "Megjelenés",
            light: "Világos",
            dark: "Sötét",
            auto: "Rendszer alapértelmezett",
        },
    },
    main: {
        title: "Üdvözlünk,"
    },
    customInput:{
        cta: "Termék felvitele",
        productName: "Termék neve",
        productCode: "Termék kódja",
        send: "Felvitel",
        searchLabel: "Keresés a termékek között"
    },
    alerts: {
        authErrorTitle: "Hiba történt a bejelentkezéskor!",
        authErrorMessage: "Kérjük, ellenőrizze az adatait és próbálja újra.",
        registrationErrorTitle: "Hiba történt a regisztrációkor!",
        registrationErrorMessage: "Kérjük, ellenőrizze az adatait és próbálja újra.",
        registrationEmailErrorMessage: "Ez az e-mail cím már használatban van!",
        registrationSuccessTitle: "Sikeres regisztráció!",
        registrationSuccessMessage: "Üdvözöljük az alkalmazásban!",
        authMissingEmail: "Kérjük, adja meg az e-mail címét!",
        authMissingPassword: "Kérjük, adja meg a jelszavát!",
        authMissingRePassword: "Kérjük, adja meg újra a jelszavát!",
        registrationMissingUsername: "Kérjük, adja meg a felhasználónevét!",
        loading: "Betöltés...",
        authPasswordMatchMessage: "A megadott jelszavak nem egyeznek!",
        errorTitle: "Hiba történt",
        loadAuthErrorMessage: "A munkamenet lejárt, kérjük jelentkezz be újra"
    },
    inventory: {
        cta: "Kamra",
        title: "Az Ön kamrája",
        permission: {
            title: "A kamera használatához engedély szükséges.",
            description:
                'Engedélyezze a kamera hozzáférést az alkalmazás beállításaiban, vagy nyomja meg az "Engedély kérése" gombot.',
            cta: "Engedély kérése",
            openSettings: "Beállítások megnyitása",
        },
        camera: {
            cta: "Kamera",
            title: "Termék hozzáadása a kamrához",
            code: "Termék kódja",
            name: "Termék neve",
            rescan: "Újra szkennelés",
            wrongscan: "Hibás bevitel javítása",
            customadd: "Termék hozzáadása a rendszerhez",
            custominput: "Kézi bevitel",
        },
        editItem: {
            title: "Termék szerkesztése",
            cta: "Szerkesztés",
            quantityInput: {
                title: "Darabszám",
                message: "Kérjük, adja meg az új darabszámot.",
                submit: "Mentés",
                cancel: "Mégsem",
                error: "Érvénytelen darabszám!",
                errorTitle: "Hiba",
            },
        },
        deleteItem: {
             title: "Termék törlése",
            cta: "db törlése",
            quantityInput: {
                title: "Darabszám",
            },
        },
    },
    shoppinglist: {
        cta: "Bevásárlólista",
        title: "A te bevásárlólistád",
        search: {
            cta: "Termékek keresése",
            notHave: "Nincs találat.",
            clear: "Nincs mára semmi a bevásárlólistán.",
        },
        stickyNote: "-t venni kell belőle",
        name: "Név",
        quantity: "Mennyiség",
        add: "Hozzáadás",
        cancel: "Mégse",
        done: "Kész",
        deleteItem: {
            title: "Tétel törlése",
            message: "Biztosan törölni szeretné ezt a terméket: ",
            submit: "Törlés",
            cancel: "Mégse"
        }
    }
};