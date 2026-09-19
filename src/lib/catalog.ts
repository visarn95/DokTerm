type CatalogItem = {
  isActive: boolean;
  services: Array<{ service: { isActive: boolean } }>;
};

export function visibleCatalog<T extends CatalogItem>(profiles: T[]) {
  return profiles
    .filter((profile) => profile.isActive)
    .map((profile) => ({ ...profile, services: profile.services.filter(({ service }) => service.isActive) }));
}
