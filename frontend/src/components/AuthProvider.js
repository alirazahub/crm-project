"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/slices/authSlice";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized]);

  return children;
}
