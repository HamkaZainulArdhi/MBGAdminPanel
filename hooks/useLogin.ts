// import { useReducer, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FirebaseError } from "firebase/app";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useAuth } from "@/lib/authContext";

// const ERROR_MESSAGES: Record<string, string> = {
//     "auth/invalid-credential": "Email atau password salah.",
//     "auth/wrong-password": "Email atau password salah.",
//     "auth/user-not-found": "Email atau password salah.",
//     "auth/invalid-email": "Format email tidak valid.",
//     "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
// };

// type State = {
//     email: string;
//     password: string;
//     error: string | null;
//     submitting: boolean;
// };

// type Action =
//     | { type: "SET_FIELD"; field: "email" | "password"; value: string }
//     | { type: "SUBMIT_START" }
//     | { type: "SUBMIT_ERROR"; message: string }
//     | { type: "SUBMIT_SUCCESS" };

// const initialState: State = {
//     email: "",
//     password: "",
//     error: null,
//     submitting: false,
// };

// function reducer(state: State, action: Action): State {
//     switch (action.type) {
//         case "SET_FIELD":
//             return { ...state, [action.field]: action.value, error: null };
//         case "SUBMIT_START":
//             return { ...state, submitting: true, error: null };
//         case "SUBMIT_ERROR":
//             return { ...state, submitting: false, error: action.message };
//         case "SUBMIT_SUCCESS":
//             return { ...state, submitting: false };
//     }
// }

// export function useLogin() {
//     const { isAuthenticated, loading } = useAuth();
//     const router = useRouter();
//     const [state, dispatch] = useReducer(reducer, initialState);

//     useEffect(() => {
//         if (!loading && isAuthenticated) {
//             router.replace("/");
//         }
//     }, [isAuthenticated, loading, router]);

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         dispatch({ type: "SUBMIT_START" });

//         try {
//             await signInWithEmailAndPassword(auth, state.email, state.password);
//             dispatch({ type: "SUBMIT_SUCCESS" });
//             router.replace("/");
//         } catch (err) {
//             const code = err instanceof FirebaseError ? err.code : "";
//             const message = ERROR_MESSAGES[code] ?? "Login gagal. Silakan coba lagi.";
//             dispatch({ type: "SUBMIT_ERROR", message });
//         }
//     }

//     return {
//         ...state,
//         isLoading: loading || isAuthenticated,
//         setField: (field: "email" | "password", value: string) =>
//             dispatch({ type: "SET_FIELD", field, value }),
//         handleSubmit,
//     };
// }