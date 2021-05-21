import { ServiceState, IUser } from "@/store/types";

export const validURL = (str: string): boolean => {
  // https://stackoverflow.com/a/5717133/11120444
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const aggregateServices = (users: [IUser]): ServiceState[] => {
  const services: ServiceState[] = [];
  users.forEach((user: IUser) => {
    user?.services?.forEach((service: ServiceState) => {
      // Remove the services key from user object
      const _user = (({ services, ...o }) => o)(user);
      // Rename services._id to services.serviceId
      if (!("serviceId" in service))
        delete Object.assign(service, { ["serviceId"]: service["_id"] })["_id"];
      services.push({ ...service, ..._user });
    });
  });
  return services;
};
