import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/recipes");

export function useRecipeBook() {
    const routeSearch = routeApi.useSearch();
}
