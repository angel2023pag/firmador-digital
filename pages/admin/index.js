/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import firebase from "../../components/firebase";
import Table from "./Table";
import Swal from "sweetalert2";
const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [{ name: "Registros", href: "/admin", current: true }];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Admin = () => {
  //control de acceso con states
  const [state, setState] = useState(false);

  //obtenemos las ips actuales registradas
  useEffect(() => {
    const booksRef = firebase.firestore().collection("ip").doc("register");
    booksRef.onSnapshot((snapshot) => {
      let productos = snapshot.data().ip;
      if (productos.length > 0) {
        fetch("https://ipinfo.io/json?token=28cd192027f3e8")
          .then((response) => response.json())
          .then((jsonResponse) => VerifyIp(jsonResponse, productos));
      }
    });
  }, []);

  const VerifyIp = (ipToVerify, ipSaved) => {
    let found = false;
    if (ipSaved.length > 0) {
      ipSaved.forEach((element, index) => {
        if (element.ip == ipToVerify.ip) {
          found = true;
          if (element.allow == 0) {
            setState(false);
          } else {
            setState(true);
          }
        }
        if (!found && index == ipSaved.length - 1) {
          ipToVerify["allow"] = 0;
          firebase
            .firestore()
            .collection("ip")
            .doc("register")
            .update({
              ip: firebase.firestore.FieldValue.arrayUnion(ipToVerify),
            }); // do something after state has updated
          setState(false);
        }
      });
    }
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      console.log("hola");
    }
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        var user = firebase.auth().currentUser;
        if (user != null || user.uid != "error") {
          console.log("hola");
        }
      } else {
        window.location.href = "/admin/login";
      }
    });
  }, []);

  const Reiniciar = () => {
    Swal.fire({
      title: "¿Quieres reiniciar todos los registros del sistema?",
      showDenyButton: true,
      confirmButtonText: "Reiniciar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        let arrayAux = [
          {user: ""}
        ]
        Swal.fire("Reiniciado", "", "success");
        let cursoRef = firebase.firestore().collection("registros").doc("registros");
        cursoRef.update({ usuario: arrayAux });
      } else if (result.isDenied) {
        Swal.fire("Sin cambios", "", "info");
      }
    });
  };

  return (
    <>
      {true ? (
        <div className="min-h-full">
          <Disclosure as="nav" className="bg-white shadow-sm">
            {({ open }) => (
              <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "border-indigo-500 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                        <button onClick={(e) => firebase.auth().signOut()}>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="sm:hidden">
                  <div className="pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                            : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
                          "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                      <button onClick={(e) => firebase.auth().signOut()}>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <div className="py-10">
            <header>
              <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 lg:flex gap-x-10">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Registros
                </h1>
                <button
                  onClick={(e) => Reiniciar()}
                  className="bg-red-600 rounded p-2 text-white font-bold"
                >
                  Reiniciar registros
                </button>
              </div>
            </header>
            <main>
              <div className="w-11/12 mx-auto sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <div className="px-4 py-8 sm:px-0">
                  <Table />
                </div>
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full text-center grid content-center">
          <p>Esperando aprobación de accesso . . .</p>
        </div>
      )}
    </>
  );
};

Admin.layout = "L2";
export default Admin;
