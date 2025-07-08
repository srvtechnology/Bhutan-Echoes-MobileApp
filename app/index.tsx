import { useEffect } from "react";
import { router, Redirect} from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/splash");
  }, []);

  return null;
}