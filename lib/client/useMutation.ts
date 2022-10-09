import { useState } from "react";

// request headers
interface MutationOptions {
  headers?: {
    [key: string]: string;
  }[];
}

// mutator function
type Mutator = (formData: any) => void;

// response data that is updated when the mutator is called.
interface MutationState<RES> {
  data: undefined | RES;
  loading: boolean;
  error: undefined | any;
}

type UseMutationResponse<RES> = [Mutator, MutationState<RES>];

export default function useMutation<REQ = any, RES = any>(
  url: string,
  options: MutationOptions = {}
): UseMutationResponse<RES> {
  const [state, setState] = useState<MutationState<RES>>({
    data: undefined,
    loading: false,
    error: undefined,
  });

  const mutator = async (formData: REQ) => {
    setState((prev) => ({ ...prev, loading: true }));
    const headers = options.headers || {};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      setState((prev) => ({ ...prev, data: json }));
    } catch (err) {
      setState((prev) => ({ ...prev, error: err }));
    }
    setState((prev) => ({ ...prev, loading: false }));
  };
  return [mutator, state];
}
