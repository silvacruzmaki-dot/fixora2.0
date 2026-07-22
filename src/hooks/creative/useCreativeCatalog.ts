"use client";

/*
 * Hook principal del catálogo Diseño / Creative.
 *
 * Responsabilidades:
 * - Consultar publicaciones desde la API.
 * - Administrar búsqueda y filtros.
 * - Aplicar debounce al buscador.
 * - Ordenar resultados.
 * - Cargar páginas adicionales.
 * - Actualizar manualmente el catálogo.
 * - Cancelar peticiones obsoletas.
 * - Evitar resultados duplicados.
 * - Exponer estados de carga y error.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Lógica administrativa.
 * - Interacciones de Me gusta o favoritos.
 * - Control del visor.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CREATIVE_DEFAULT_CATALOG_SORT,
  CREATIVE_PAGINATION,
} from "@/constants/creative/creative.constants";

import {
  CREATIVE_API_ROUTES,
  CREATIVE_QUERY_KEYS,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiItemSummary,
  CreativeApiLanguage,
  CreativeApiResponse,
  CreativeCatalogApiData,
  CreativeCatalogFilterOptions,
  CreativeCatalogQuery,
  CreativeCatalogSort,
  CreativeCatalogStatistics,
  CreativePagination,
} from "@/types/creative/creative-api.types";

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   ESTADO DE FILTROS DEL HOOK
   ========================================================= */

export interface CreativeCatalogFiltersState {
  search: string;

  contentTypes: CreativeContentType[];

  categoryIds: CreativeCategoryId[];

  toolIds: CreativeToolId[];

  featured: boolean | null;

  sort: CreativeCatalogSort;

  pageSize: number;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeCatalogOptions {
  /*
   * Filtros utilizados en la primera carga.
   */
  initialQuery?: Partial<CreativeCatalogQuery>;

  /*
   * Datos obtenidos previamente desde un Server Component.
   */
  initialData?: CreativeCatalogApiData | null;

  /*
   * Idioma utilizado para los errores devueltos por la API.
   */
  language?: CreativeApiLanguage;

  /*
   * Permite desactivar temporalmente las consultas.
   */
  enabled?: boolean;

  /*
   * Tiempo de espera antes de ejecutar una búsqueda.
   */
  searchDebounceMs?: number;

  /*
   * Cuando existen datos iniciales, determina si deben
   * actualizarse nuevamente al montar el componente.
   */
  revalidateOnMount?: boolean;
}

/* =========================================================
   MODO DE SOLICITUD
   ========================================================= */

type CreativeCatalogRequestMode =
  | "REPLACE"
  | "APPEND"
  | "REFRESH";

/* =========================================================
   RESPUESTA DEL HOOK
   ========================================================= */

export interface UseCreativeCatalogResult {
  items: CreativeApiItemSummary[];

  filters: CreativeCatalogFiltersState;

  filterOptions: CreativeCatalogFilterOptions;

  statistics: CreativeCatalogStatistics;

  pagination: CreativePagination;

  currentQuery: CreativeCatalogQuery;

  loading: boolean;

  initialLoading: boolean;

  refreshing: boolean;

  loadingMore: boolean;

  searching: boolean;

  errorMessage: string | null;

  hasError: boolean;

  empty: boolean;

  hasItems: boolean;

  hasMoreItems: boolean;

  totalItems: number;

  visibleItemsCount: number;

  activeFilterCount: number;

  hasActiveFilters: boolean;

  lastUpdatedAt: number | null;

  setSearch: (search: string) => void;

  toggleContentType: (
    contentType: CreativeContentType,
  ) => void;

  setContentTypes: (
    contentTypes: readonly CreativeContentType[],
  ) => void;

  toggleCategory: (
    categoryId: CreativeCategoryId,
  ) => void;

  selectSingleCategory: (
    categoryId: CreativeCategoryId,
  ) => void;

  setCategoryIds: (
    categoryIds: readonly CreativeCategoryId[],
  ) => void;

  toggleTool: (
    toolId: CreativeToolId,
  ) => void;

  setToolIds: (
    toolIds: readonly CreativeToolId[],
  ) => void;

  setFeatured: (
    featured: boolean | null,
  ) => void;

  setSort: (
    sort: CreativeCatalogSort,
  ) => void;

  setPageSize: (
    pageSize: number,
  ) => void;

  clearFilters: () => void;

  refresh: () => Promise<void>;

  retry: () => Promise<void>;

  loadMore: () => Promise<void>;

  cancelCurrentRequest: () => void;
}

/* =========================================================
   VALORES VACÍOS
   ========================================================= */

const EMPTY_CREATIVE_FILTER_OPTIONS:
  CreativeCatalogFilterOptions = {
    contentTypes: [],
    categories: [],
    tools: [],
  };

const EMPTY_CREATIVE_CATALOG_STATISTICS:
  CreativeCatalogStatistics = {
    totalPublished: 0,
    totalFree: 0,
    totalPaid: 0,
    totalPortfolio: 0,
  };

/* =========================================================
   CREAR PAGINACIÓN VACÍA
   ========================================================= */

function createEmptyCreativePagination(
  pageSize: number,
): CreativePagination {
  return {
    page: 1,
    pageSize,
    totalItems: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

/* =========================================================
   NORMALIZAR VALORES ÚNICOS
   ========================================================= */

function normalizeUniqueValues<
  TValue extends string,
>(
  values: readonly TValue[] | null | undefined,
): TValue[] {
  if (!values || values.length === 0) {
    return [];
  }

  return Array.from(
    new Set(values),
  );
}

/* =========================================================
   NORMALIZAR TAMAÑO DE PÁGINA
   ========================================================= */

function normalizeCreativePageSize(
  pageSize: number | null | undefined,
): number {
  if (
    typeof pageSize !== "number" ||
    !Number.isFinite(pageSize)
  ) {
    return CREATIVE_PAGINATION.DEFAULT_PAGE_SIZE;
  }

  const integerPageSize =
    Math.trunc(pageSize);

  return Math.min(
    CREATIVE_PAGINATION.MAXIMUM_PAGE_SIZE,
    Math.max(
      CREATIVE_PAGINATION.MINIMUM_PAGE_SIZE,
      integerPageSize,
    ),
  );
}

/* =========================================================
   CREAR FILTROS INICIALES
   ========================================================= */

function createInitialCreativeCatalogFilters(
  initialQuery: Partial<CreativeCatalogQuery> = {},
): CreativeCatalogFiltersState {
  return {
    search:
      initialQuery.search ??
      "",

    contentTypes:
      normalizeUniqueValues(
        initialQuery.contentTypes,
      ),

    categoryIds:
      normalizeUniqueValues(
        initialQuery.categoryIds,
      ),

    toolIds:
      normalizeUniqueValues(
        initialQuery.toolIds,
      ),

    featured:
      typeof initialQuery.featured === "boolean"
        ? initialQuery.featured
        : null,

    sort:
      initialQuery.sort ??
      CREATIVE_DEFAULT_CATALOG_SORT,

    pageSize:
      normalizeCreativePageSize(
        initialQuery.pageSize,
      ),
  };
}

/* =========================================================
   ALTERNAR UN VALOR DE UNA LISTA
   ========================================================= */

function toggleCreativeFilterValue<
  TValue extends string,
>(
  currentValues: readonly TValue[],
  value: TValue,
): TValue[] {
  if (currentValues.includes(value)) {
    return currentValues.filter(
      (currentValue) =>
        currentValue !== value,
    );
  }

  return [
    ...currentValues,
    value,
  ];
}

/* =========================================================
   CONVERTIR FILTROS EN CONSULTA
   ========================================================= */

function createCreativeCatalogQuery(
  filters: CreativeCatalogFiltersState,
  page: number,
  searchOverride?: string,
): CreativeCatalogQuery {
  const normalizedSearch =
    (
      searchOverride ??
      filters.search
    ).trim();

  const query: CreativeCatalogQuery = {
    sort:
      filters.sort,

    page:
      Math.max(
        1,
        Math.trunc(page),
      ),

    pageSize:
      filters.pageSize,
  };

  if (normalizedSearch) {
    query.search =
      normalizedSearch;
  }

  if (filters.contentTypes.length > 0) {
    query.contentTypes = [
      ...filters.contentTypes,
    ];
  }

  if (filters.categoryIds.length > 0) {
    query.categoryIds = [
      ...filters.categoryIds,
    ];
  }

  if (filters.toolIds.length > 0) {
    query.toolIds = [
      ...filters.toolIds,
    ];
  }

  if (typeof filters.featured === "boolean") {
    query.featured =
      filters.featured;
  }

  return query;
}

/* =========================================================
   CONSTRUIR URL DE LA API
   ========================================================= */

function createCreativeCatalogApiUrl(
  query: CreativeCatalogQuery,
): string {
  const searchParams =
    new URLSearchParams();

  const normalizedSearch =
    query.search?.trim();

  if (normalizedSearch) {
    searchParams.set(
      CREATIVE_QUERY_KEYS.SEARCH,
      normalizedSearch,
    );
  }

  query.contentTypes?.forEach(
    (contentType) => {
      searchParams.append(
        CREATIVE_QUERY_KEYS.CONTENT_TYPE,
        contentType,
      );
    },
  );

  query.categoryIds?.forEach(
    (categoryId) => {
      searchParams.append(
        CREATIVE_QUERY_KEYS.CATEGORY,
        categoryId,
      );
    },
  );

  query.toolIds?.forEach(
    (toolId) => {
      searchParams.append(
        CREATIVE_QUERY_KEYS.TOOL,
        toolId,
      );
    },
  );

  if (typeof query.featured === "boolean") {
    searchParams.set(
      CREATIVE_QUERY_KEYS.FEATURED,
      String(query.featured),
    );
  }

  if (query.sort) {
    searchParams.set(
      CREATIVE_QUERY_KEYS.SORT,
      query.sort,
    );
  }

  if (typeof query.page === "number") {
    searchParams.set(
      CREATIVE_QUERY_KEYS.PAGE,
      String(query.page),
    );
  }

  if (typeof query.pageSize === "number") {
    searchParams.set(
      CREATIVE_QUERY_KEYS.PAGE_SIZE,
      String(query.pageSize),
    );
  }

  const queryString =
    searchParams.toString();

  if (!queryString) {
    return CREATIVE_API_ROUTES.ITEMS;
  }

  return `${CREATIVE_API_ROUTES.ITEMS}?${queryString}`;
}

/* =========================================================
   UNIR RESULTADOS SIN DUPLICADOS
   ========================================================= */

function mergeCreativeCatalogItems(
  currentItems: readonly CreativeApiItemSummary[],
  incomingItems: readonly CreativeApiItemSummary[],
): CreativeApiItemSummary[] {
  const itemMap =
    new Map<
      string,
      CreativeApiItemSummary
    >();

  currentItems.forEach(
    (item) => {
      itemMap.set(
        item.id,
        item,
      );
    },
  );

  incomingItems.forEach(
    (item) => {
      itemMap.set(
        item.id,
        item,
      );
    },
  );

  return Array.from(
    itemMap.values(),
  );
}

/* =========================================================
   EXTRAER MENSAJE DE ERROR
   ========================================================= */

function getCreativeCatalogErrorMessage(
  response:
    | CreativeApiResponse<CreativeCatalogApiData>
    | null,
  language: CreativeApiLanguage,
  fallbackMessage: string,
): string {
  if (
    response &&
    response.ok === false
  ) {
    return response.message[
      language
    ];
  }

  return fallbackMessage;
}

/* =========================================================
   DETECTAR ERROR DE ABORTO
   ========================================================= */

function isCreativeAbortError(
  error: unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeCatalog(
  options: UseCreativeCatalogOptions = {},
): UseCreativeCatalogResult {
  const {
    initialQuery = {},
    initialData = null,
    language = "es",
    enabled = true,
    searchDebounceMs = 350,
    revalidateOnMount = true,
  } = options;

  /* =======================================================
     FILTROS
     ======================================================= */

  const [
    filters,
    setFilters,
  ] =
    useState<CreativeCatalogFiltersState>(
      () =>
        createInitialCreativeCatalogFilters(
          initialQuery,
        ),
    );

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] =
    useState<string>(
      () =>
        filters.search,
    );

  /* =======================================================
     DATOS
     ======================================================= */

  const [
    items,
    setItems,
  ] =
    useState<CreativeApiItemSummary[]>(
      () =>
        initialData?.items ??
        [],
    );

  const [
    filterOptions,
    setFilterOptions,
  ] =
    useState<CreativeCatalogFilterOptions>(
      () =>
        initialData?.filterOptions ??
        EMPTY_CREATIVE_FILTER_OPTIONS,
    );

  const [
    statistics,
    setStatistics,
  ] =
    useState<CreativeCatalogStatistics>(
      () =>
        initialData?.statistics ??
        EMPTY_CREATIVE_CATALOG_STATISTICS,
    );

  const [
    pagination,
    setPagination,
  ] =
    useState<CreativePagination>(
      () =>
        initialData?.pagination ??
        createEmptyCreativePagination(
          createInitialCreativeCatalogFilters(
            initialQuery,
          ).pageSize,
        ),
    );

  /* =======================================================
     ESTADOS DE SOLICITUD
     ======================================================= */

  const [
    loading,
    setLoading,
  ] =
    useState<boolean>(
      false,
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState<boolean>(
      false,
    );

  const [
    loadingMore,
    setLoadingMore,
  ] =
    useState<boolean>(
      false,
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * Debe comenzar en null.
   *
   * No se utiliza Date.now() durante el render porque React
   * Compiler considera esa operación impura.
   *
   * El valor se actualizará únicamente después de que una
   * solicitud termine correctamente.
   */
  const [
    lastUpdatedAt,
    setLastUpdatedAt,
  ] =
    useState<number | null>(
      null,
    );

  /* =======================================================
     REFERENCIAS DE CONTROL
     ======================================================= */

  const abortControllerRef =
    useRef<AbortController | null>(
      null,
    );

  const requestSequenceRef =
    useRef<number>(
      0,
    );

  const skipInitialRequestRef =
    useRef<boolean>(
      Boolean(
        initialData &&
        !revalidateOnMount,
      ),
    );

  /* =======================================================
     NORMALIZAR RETRASO DEL BUSCADOR
     ======================================================= */

  const normalizedSearchDebounceMs =
    useMemo(
      () =>
        Math.max(
          0,
          Math.trunc(
            searchDebounceMs,
          ),
        ),
      [
        searchDebounceMs,
      ],
    );

  /* =======================================================
     APLICAR DEBOUNCE AL BUSCADOR
     ======================================================= */

  useEffect(
    () => {
      const timeoutId =
        window.setTimeout(
          () => {
            setDebouncedSearch(
              filters.search,
            );
          },
          normalizedSearchDebounceMs,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [
      filters.search,
      normalizedSearchDebounceMs,
    ],
  );

  /* =======================================================
     CONSULTA EFECTIVA
     ======================================================= */

  /*
   * La función recibe el objeto completo filters.
   *
   * Por esa razón, filters debe aparecer como dependencia
   * completa del useMemo. Esto elimina la advertencia de
   * react-hooks/exhaustive-deps.
   */
  const currentQuery =
    useMemo(
      () =>
        createCreativeCatalogQuery(
          filters,
          1,
          debouncedSearch,
        ),
      [
        filters,
        debouncedSearch,
      ],
    );

  /* =======================================================
     CANCELAR SOLICITUD ACTUAL
     ======================================================= */

  const cancelCurrentRequest =
    useCallback(
      () => {
        abortControllerRef.current?.abort();

        abortControllerRef.current =
          null;
      },
      [],
    );

  /* =======================================================
     CANCELAR CUANDO EL HOOK SE DESACTIVA
     ======================================================= */

  useEffect(
    () => {
      if (!enabled) {
        cancelCurrentRequest();
      }
    },
    [
      enabled,
      cancelCurrentRequest,
    ],
  );

  /* =======================================================
     CONSULTAR CATÁLOGO
     ======================================================= */

  const requestCatalog =
    useCallback(
      async (
        query: CreativeCatalogQuery,
        mode: CreativeCatalogRequestMode,
      ): Promise<void> => {
        cancelCurrentRequest();

        const abortController =
          new AbortController();

        abortControllerRef.current =
          abortController;

        const requestSequence =
          requestSequenceRef.current +
          1;

        requestSequenceRef.current =
          requestSequence;

        setErrorMessage(
          null,
        );

        if (mode === "APPEND") {
          setLoadingMore(
            true,
          );
        } else if (mode === "REFRESH") {
          setRefreshing(
            true,
          );
        } else {
          setLoading(
            true,
          );
        }

        try {
          const response =
            await fetch(
              createCreativeCatalogApiUrl(
                query,
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/json",
                },

                cache:
                  "no-store",

                credentials:
                  "same-origin",

                signal:
                  abortController.signal,
              },
            );

          const payload =
            (
              await response
                .json()
                .catch(
                  () =>
                    null,
                )
            ) as
              | CreativeApiResponse<CreativeCatalogApiData>
              | null;

          if (
            !response.ok ||
            !payload ||
            payload.ok === false
          ) {
            const fallbackMessage =
              language === "en"
                ? "The creative catalog could not be loaded."
                : "No fue posible cargar el catálogo creativo.";

            throw new Error(
              getCreativeCatalogErrorMessage(
                payload,
                language,
                fallbackMessage,
              ),
            );
          }

          /*
           * Ignora respuestas antiguas cuando una solicitud
           * más reciente ya fue iniciada.
           */
          if (
            requestSequence !==
            requestSequenceRef.current
          ) {
            return;
          }

          if (mode === "APPEND") {
            setItems(
              (currentItems) =>
                mergeCreativeCatalogItems(
                  currentItems,
                  payload.data.items,
                ),
            );
          } else {
            setItems(
              payload.data.items,
            );
          }

          setFilterOptions(
            payload.data.filterOptions,
          );

          setStatistics(
            payload.data.statistics,
          );

          setPagination(
            payload.data.pagination,
          );

          /*
           * Date.now() se ejecuta después de una respuesta
           * exitosa, nunca durante el renderizado.
           */
          setLastUpdatedAt(
            Date.now(),
          );
        } catch (error) {
          if (
            isCreativeAbortError(
              error,
            )
          ) {
            return;
          }

          if (
            requestSequence !==
            requestSequenceRef.current
          ) {
            return;
          }

          const fallbackMessage =
            language === "en"
              ? "The creative catalog could not be loaded."
              : "No fue posible cargar el catálogo creativo.";

          setErrorMessage(
            error instanceof Error
              ? error.message
              : fallbackMessage,
          );
        } finally {
          /*
           * Solo la solicitud más reciente puede modificar
           * los estados de carga.
           */
          if (
            requestSequence ===
            requestSequenceRef.current
          ) {
            setLoading(
              false,
            );

            setRefreshing(
              false,
            );

            setLoadingMore(
              false,
            );

            if (
              abortControllerRef.current ===
              abortController
            ) {
              abortControllerRef.current =
                null;
            }
          }
        }
      },
      [
        cancelCurrentRequest,
        language,
      ],
    );

  /* =======================================================
     CARGA AUTOMÁTICA AL CAMBIAR FILTROS
     ======================================================= */

  useEffect(
    () => {
      if (!enabled) {
        return;
      }

      if (
        skipInitialRequestRef.current
      ) {
        skipInitialRequestRef.current =
          false;

        return;
      }

      void requestCatalog(
        currentQuery,
        "REPLACE",
      );
    },
    [
      currentQuery,
      enabled,
      requestCatalog,
    ],
  );

  /* =======================================================
     CANCELACIÓN AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        abortControllerRef.current?.abort();
      };
    },
    [],
  );

  /* =======================================================
     ACTUALIZAR BUSCADOR
     ======================================================= */

  const setSearch =
    useCallback(
      (
        search: string,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,
            search,
          }),
        );
      },
      [],
    );

  /* =======================================================
     FILTRO POR TIPO DE CONTENIDO
     ======================================================= */

  const toggleContentType =
    useCallback(
      (
        contentType: CreativeContentType,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            contentTypes:
              toggleCreativeFilterValue(
                currentFilters.contentTypes,
                contentType,
              ),
          }),
        );
      },
      [],
    );

  const setContentTypes =
    useCallback(
      (
        contentTypes:
          readonly CreativeContentType[],
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            contentTypes:
              normalizeUniqueValues(
                contentTypes,
              ),
          }),
        );
      },
      [],
    );

  /* =======================================================
     FILTRO POR CATEGORÍA
     ======================================================= */

  const toggleCategory =
    useCallback(
      (
        categoryId: CreativeCategoryId,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            categoryIds:
              toggleCreativeFilterValue(
                currentFilters.categoryIds,
                categoryId,
              ),
          }),
        );
      },
      [],
    );

  const selectSingleCategory =
    useCallback(
      (
        categoryId: CreativeCategoryId,
      ) => {
        setFilters(
          (currentFilters) => {
            const alreadySelected =
              currentFilters.categoryIds.length === 1 &&
              currentFilters.categoryIds[0] ===
                categoryId;

            return {
              ...currentFilters,

              categoryIds:
                alreadySelected
                  ? []
                  : [
                      categoryId,
                    ],
            };
          },
        );
      },
      [],
    );

  const setCategoryIds =
    useCallback(
      (
        categoryIds:
          readonly CreativeCategoryId[],
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            categoryIds:
              normalizeUniqueValues(
                categoryIds,
              ),
          }),
        );
      },
      [],
    );

  /* =======================================================
     FILTRO POR HERRAMIENTA
     ======================================================= */

  const toggleTool =
    useCallback(
      (
        toolId: CreativeToolId,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            toolIds:
              toggleCreativeFilterValue(
                currentFilters.toolIds,
                toolId,
              ),
          }),
        );
      },
      [],
    );

  const setToolIds =
    useCallback(
      (
        toolIds:
          readonly CreativeToolId[],
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            toolIds:
              normalizeUniqueValues(
                toolIds,
              ),
          }),
        );
      },
      [],
    );

  /* =======================================================
     FILTRO DE DESTACADOS
     ======================================================= */

  const setFeatured =
    useCallback(
      (
        featured: boolean | null,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,
            featured,
          }),
        );
      },
      [],
    );

  /* =======================================================
     ORDENAMIENTO
     ======================================================= */

  const setSort =
    useCallback(
      (
        sort: CreativeCatalogSort,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,
            sort,
          }),
        );
      },
      [],
    );

  /* =======================================================
     TAMAÑO DE PÁGINA
     ======================================================= */

  const setPageSize =
    useCallback(
      (
        pageSize: number,
      ) => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,

            pageSize:
              normalizeCreativePageSize(
                pageSize,
              ),
          }),
        );
      },
      [],
    );

  /* =======================================================
     LIMPIAR FILTROS
     ======================================================= */

  const clearFilters =
    useCallback(
      () => {
        const initialFilters =
          createInitialCreativeCatalogFilters();

        setFilters(
          initialFilters,
        );

        setDebouncedSearch(
          initialFilters.search,
        );
      },
      [],
    );

  /* =======================================================
     ACTUALIZAR CATÁLOGO
     ======================================================= */

  const refresh =
    useCallback(
      async (): Promise<void> => {
        if (!enabled) {
          return;
        }

        const refreshQuery =
          createCreativeCatalogQuery(
            filters,
            1,
            filters.search,
          );

        setDebouncedSearch(
          filters.search,
        );

        await requestCatalog(
          refreshQuery,
          "REFRESH",
        );
      },
      [
        enabled,
        filters,
        requestCatalog,
      ],
    );

  /* =======================================================
     REINTENTAR
     ======================================================= */

  const retry =
    useCallback(
      async (): Promise<void> => {
        await refresh();
      },
      [
        refresh,
      ],
    );

  /* =======================================================
     BUSQUEDA EN PROCESO
     ======================================================= */

  const searching =
    filters.search !==
    debouncedSearch;

  /* =======================================================
     CARGAR MÁS
     ======================================================= */

  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          !enabled ||
          loading ||
          refreshing ||
          loadingMore ||
          searching ||
          !pagination.hasNextPage
        ) {
          return;
        }

        const nextPage =
          pagination.page +
          1;

        const nextPageQuery =
          createCreativeCatalogQuery(
            filters,
            nextPage,
            debouncedSearch,
          );

        await requestCatalog(
          nextPageQuery,
          "APPEND",
        );
      },
      [
        debouncedSearch,
        enabled,
        filters,
        loading,
        loadingMore,
        pagination.hasNextPage,
        pagination.page,
        refreshing,
        requestCatalog,
        searching,
      ],
    );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const activeFilterCount =
    useMemo(
      () => {
        let total =
          0;

        if (filters.search.trim()) {
          total += 1;
        }

        total +=
          filters.contentTypes.length;

        total +=
          filters.categoryIds.length;

        total +=
          filters.toolIds.length;

        if (filters.featured !== null) {
          total += 1;
        }

        if (
          filters.sort !==
          CREATIVE_DEFAULT_CATALOG_SORT
        ) {
          total += 1;
        }

        return total;
      },
      [
        filters,
      ],
    );

  const hasActiveFilters =
    activeFilterCount > 0;

  const hasItems =
    items.length > 0;

  const initialLoading =
    loading &&
    !hasItems;

  const empty =
    !loading &&
    !refreshing &&
    !hasItems &&
    errorMessage === null;

  const hasMoreItems =
    pagination.hasNextPage;

  const totalItems =
    pagination.totalItems;

  const visibleItemsCount =
    items.length;

  const hasError =
    errorMessage !== null;

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    items,
    filters,
    filterOptions,
    statistics,
    pagination,
    currentQuery,
    loading,
    initialLoading,
    refreshing,
    loadingMore,
    searching,
    errorMessage,
    hasError,
    empty,
    hasItems,
    hasMoreItems,
    totalItems,
    visibleItemsCount,
    activeFilterCount,
    hasActiveFilters,
    lastUpdatedAt,
    setSearch,
    toggleContentType,
    setContentTypes,
    toggleCategory,
    selectSingleCategory,
    setCategoryIds,
    toggleTool,
    setToolIds,
    setFeatured,
    setSort,
    setPageSize,
    clearFilters,
    refresh,
    retry,
    loadMore,
    cancelCurrentRequest,
  };
}