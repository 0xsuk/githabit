import { GASAPI } from "../constants";

if (!GASAPI) {
  alert("GASAPI is not set");
}
export const login = (password) => {
  return fetch(GASAPI, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      password,
    }),
  });
};

export const fetchData = (sid) => {
  return fetch(GASAPI, {
    method: "POST",
    body: JSON.stringify({
      action: "fetch",
      sid,
    }),
  });
};

export const handleUpdate = (sid, count) => {
  return fetch(GASAPI, {
    method: "POST",
    body: JSON.stringify({
      action: "update",
      sid,
      count,
    }),
  });
};
