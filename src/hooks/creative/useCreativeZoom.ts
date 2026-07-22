"use client";

/*
 * Hook de zoom y desplazamiento del visor Diseño / Creative.
 *
 * Responsabilidades:
 * - Acercar y alejar la imagen.
 * - Mantener límites mínimos y máximos.
 * - Aplicar zoom desde la posición del cursor.
 * - Arrastrar la imagen cuando está ampliada.
 * - Evitar que la imagen desaparezca del contenedor.
 * - Restablecer la transformación.
 * - Medir automáticamente el contenedor y la imagen.
 * - Gestionar rueda, doble clic, puntero y teclado.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso a Prisma.
 * - Llamadas HTTP.
 * - Comentarios.
 * - Compras.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefCallback,
  WheelEvent as ReactWheelEvent,
} from "react";

import {
  CREATIVE_VIEWER,
  CREATIVE_VIEWER_KEYS,
  CREATIVE_VIEWER_ZOOM_LIMITS,
} from "@/constants/creative/creative.constants";

import type {
  CreativeViewerBounds,
  CreativeViewerPanState,
  CreativeViewerPoint,
  CreativeViewerSize,
  CreativeViewerTransformState,
  CreativeViewerZoomLimits,
  CreativeViewerZoomState,
} from "@/types/creative/creative-viewer.types";

/* =========================================================
   CONSTANTES INTERNAS
   ========================================================= */

const CREATIVE_ZOOM_EPSILON =
  0.0001;

const EMPTY_CREATIVE_POINT:
  CreativeViewerPoint = {
    x: 0,
    y: 0,
  };

const EMPTY_CREATIVE_BOUNDS:
  CreativeViewerBounds = {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  };

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeZoomOptions {
  enabled?:
    boolean;

  limits?:
    Partial<CreativeViewerZoomLimits>;

  initialScale?:
    number;

  wheelZoomEnabled?:
    boolean;

  wheelZoomSensitivity?:
    number;

  dragEnabled?:
    boolean;

  doubleClickZoomEnabled?:
    boolean;

  doubleClickScale?:
    number;

  keyboardEnabled?:
    boolean;

  transitionDurationMs?:
    number;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeZoomResult {
  transform:
    CreativeViewerTransformState;

  zoom:
    CreativeViewerZoomState;

  pan:
    CreativeViewerPanState;

  scale:
    number;

  percentage:
    number;

  position:
    CreativeViewerPoint;

  bounds:
    CreativeViewerBounds;

  containerSize:
    CreativeViewerSize | null;

  mediaSize:
    CreativeViewerSize | null;

  enabled:
    boolean;

  dragging:
    boolean;

  hasMoved:
    boolean;

  canZoomIn:
    boolean;

  canZoomOut:
    boolean;

  canDrag:
    boolean;

  isDefault:
    boolean;

  containerRef:
    RefCallback<HTMLElement>;

  mediaRef:
    RefCallback<HTMLElement>;

  mediaStyle:
    CSSProperties;

  zoomIn:
    (
      focalPoint?:
        CreativeViewerPoint,
    ) => void;

  zoomOut:
    (
      focalPoint?:
        CreativeViewerPoint,
    ) => void;

  setZoom:
    (
      scale:
        number,
      focalPoint?:
        CreativeViewerPoint,
    ) => void;

  setPan:
    (
      position:
        CreativeViewerPoint,
    ) => void;

  centerImage:
    () => void;

  resetTransform:
    () => void;

  refreshMeasurements:
    () => void;

  handleWheel:
    (
      event:
        ReactWheelEvent<HTMLElement>,
    ) => void;

  handleDoubleClick:
    (
      event:
        ReactMouseEvent<HTMLElement>,
    ) => void;

  handlePointerDown:
    (
      event:
        ReactPointerEvent<HTMLElement>,
    ) => void;

  handlePointerMove:
    (
      event:
        ReactPointerEvent<HTMLElement>,
    ) => void;

  handlePointerUp:
    (
      event:
        ReactPointerEvent<HTMLElement>,
    ) => void;

  handlePointerCancel:
    (
      event:
        ReactPointerEvent<HTMLElement>,
    ) => void;

  handleLostPointerCapture:
    (
      event:
        ReactPointerEvent<HTMLElement>,
    ) => void;

  handleKeyDown:
    (
      event:
        ReactKeyboardEvent<HTMLElement>,
    ) => void;
}

/* =========================================================
   LIMITAR UN NÚMERO
   ========================================================= */

function clampCreativeNumber(
  value:
    number,
  minimum:
    number,
  maximum:
    number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

/* =========================================================
   COMPARAR NÚMEROS DECIMALES
   ========================================================= */

function areCreativeNumbersClose(
  firstValue:
    number,
  secondValue:
    number,
): boolean {
  return (
    Math.abs(
      firstValue -
      secondValue,
    ) <=
    CREATIVE_ZOOM_EPSILON
  );
}

/* =========================================================
   NORMALIZAR LÍMITES
   ========================================================= */

/*
 * Recibe valores individuales para evitar depender del
 * objeto completo "limits" dentro de useMemo.
 */
function normalizeCreativeZoomLimits(
  requestedMinimum:
    number | undefined,
  requestedMaximum:
    number | undefined,
  requestedStep:
    number | undefined,
  requestedDefaultScale:
    number | undefined,
): CreativeViewerZoomLimits {
  const minimum =
    typeof requestedMinimum ===
      "number" &&
    Number.isFinite(
      requestedMinimum,
    ) &&
    requestedMinimum >
      0
      ? requestedMinimum
      : CREATIVE_VIEWER_ZOOM_LIMITS.minimum;

  const maximumCandidate =
    typeof requestedMaximum ===
      "number" &&
    Number.isFinite(
      requestedMaximum,
    )
      ? requestedMaximum
      : CREATIVE_VIEWER_ZOOM_LIMITS.maximum;

  const maximum =
    Math.max(
      minimum,
      maximumCandidate,
    );

  const step =
    typeof requestedStep ===
      "number" &&
    Number.isFinite(
      requestedStep,
    ) &&
    requestedStep >
      0
      ? requestedStep
      : CREATIVE_VIEWER_ZOOM_LIMITS.step;

  const defaultScaleCandidate =
    typeof requestedDefaultScale ===
      "number" &&
    Number.isFinite(
      requestedDefaultScale,
    )
      ? requestedDefaultScale
      : CREATIVE_VIEWER_ZOOM_LIMITS.defaultScale;

  const defaultScale =
    clampCreativeNumber(
      defaultScaleCandidate,
      minimum,
      maximum,
    );

  return {
    minimum,
    maximum,
    step,
    defaultScale,
  };
}

/* =========================================================
   NORMALIZAR ESCALA
   ========================================================= */

function normalizeCreativeScale(
  scale:
    number,
  limits:
    CreativeViewerZoomLimits,
): number {
  if (
    !Number.isFinite(
      scale,
    )
  ) {
    return limits.defaultScale;
  }

  return clampCreativeNumber(
    scale,
    limits.minimum,
    limits.maximum,
  );
}

/* =========================================================
   CREAR ESTADO DE ZOOM
   ========================================================= */

function createCreativeZoomState(
  scale:
    number,
  limits:
    CreativeViewerZoomLimits,
  lastUpdatedAt:
    number | null,
): CreativeViewerZoomState {
  const normalizedScale =
    normalizeCreativeScale(
      scale,
      limits,
    );

  return {
    scale:
      normalizedScale,

    percentage:
      Math.round(
        normalizedScale *
        100,
      ),

    minimum:
      limits.minimum,

    maximum:
      limits.maximum,

    step:
      limits.step,

    canZoomIn:
      normalizedScale <
      (
        limits.maximum -
        CREATIVE_ZOOM_EPSILON
      ),

    canZoomOut:
      normalizedScale >
      (
        limits.minimum +
        CREATIVE_ZOOM_EPSILON
      ),

    isDefault:
      areCreativeNumbersClose(
        normalizedScale,
        limits.defaultScale,
      ),

    lastUpdatedAt,
  };
}

/* =========================================================
   CREAR ESTADO DE DESPLAZAMIENTO
   ========================================================= */

function createCreativePanState():
  CreativeViewerPanState {
  return {
    position: {
      ...EMPTY_CREATIVE_POINT,
    },

    startPosition:
      null,

    pointerStart:
      null,

    bounds: {
      ...EMPTY_CREATIVE_BOUNDS,
    },

    dragging:
      false,

    hasMoved:
      false,

    pointerId:
      null,
  };
}

/* =========================================================
   CREAR ESTADO INICIAL
   ========================================================= */

function createInitialCreativeTransform(
  limits:
    CreativeViewerZoomLimits,
  initialScale:
    number | undefined,
): CreativeViewerTransformState {
  const scale =
    normalizeCreativeScale(
      initialScale ??
      limits.defaultScale,
      limits,
    );

  return {
    zoom:
      createCreativeZoomState(
        scale,
        limits,
        null,
      ),

    pan:
      createCreativePanState(),

    transformOrigin: {
      x: 0.5,
      y: 0.5,
    },

    transitionEnabled:
      true,
  };
}

/* =========================================================
   MEDIR ELEMENTO
   ========================================================= */

function measureCreativeElement(
  element:
    HTMLElement | null,
): CreativeViewerSize | null {
  if (
    !element
  ) {
    return null;
  }

  const width =
    element.clientWidth;

  const height =
    element.clientHeight;

  if (
    width <=
      0 ||
    height <=
      0
  ) {
    return null;
  }

  return {
    width,
    height,
  };
}

/* =========================================================
   COMPARAR TAMAÑOS
   ========================================================= */

function areCreativeSizesEqual(
  firstSize:
    CreativeViewerSize | null,
  secondSize:
    CreativeViewerSize | null,
): boolean {
  if (
    firstSize ===
    secondSize
  ) {
    return true;
  }

  if (
    !firstSize ||
    !secondSize
  ) {
    return false;
  }

  return (
    areCreativeNumbersClose(
      firstSize.width,
      secondSize.width,
    ) &&
    areCreativeNumbersClose(
      firstSize.height,
      secondSize.height,
    )
  );
}

/* =========================================================
   COMPARAR PUNTOS
   ========================================================= */

function areCreativePointsEqual(
  firstPoint:
    CreativeViewerPoint,
  secondPoint:
    CreativeViewerPoint,
): boolean {
  return (
    areCreativeNumbersClose(
      firstPoint.x,
      secondPoint.x,
    ) &&
    areCreativeNumbersClose(
      firstPoint.y,
      secondPoint.y,
    )
  );
}

/* =========================================================
   COMPARAR LÍMITES
   ========================================================= */

function areCreativeBoundsEqual(
  firstBounds:
    CreativeViewerBounds | null,
  secondBounds:
    CreativeViewerBounds | null,
): boolean {
  if (
    firstBounds ===
    secondBounds
  ) {
    return true;
  }

  if (
    !firstBounds ||
    !secondBounds
  ) {
    return false;
  }

  return (
    areCreativeNumbersClose(
      firstBounds.minX,
      secondBounds.minX,
    ) &&
    areCreativeNumbersClose(
      firstBounds.maxX,
      secondBounds.maxX,
    ) &&
    areCreativeNumbersClose(
      firstBounds.minY,
      secondBounds.minY,
    ) &&
    areCreativeNumbersClose(
      firstBounds.maxY,
      secondBounds.maxY,
    )
  );
}

/* =========================================================
   CALCULAR LÍMITES DE DESPLAZAMIENTO
   ========================================================= */

function calculateCreativePanBounds(
  containerSize:
    CreativeViewerSize | null,
  mediaSize:
    CreativeViewerSize | null,
  scale:
    number,
): CreativeViewerBounds {
  if (
    !containerSize ||
    !mediaSize
  ) {
    return {
      ...EMPTY_CREATIVE_BOUNDS,
    };
  }

  const scaledWidth =
    mediaSize.width *
    scale;

  const scaledHeight =
    mediaSize.height *
    scale;

  const maximumX =
    Math.max(
      0,
      (
        scaledWidth -
        containerSize.width
      ) /
      2,
    );

  const maximumY =
    Math.max(
      0,
      (
        scaledHeight -
        containerSize.height
      ) /
      2,
    );

  return {
    minX:
      -maximumX,

    maxX:
      maximumX,

    minY:
      -maximumY,

    maxY:
      maximumY,
  };
}

/* =========================================================
   LIMITAR POSICIÓN
   ========================================================= */

function clampCreativePanPosition(
  position:
    CreativeViewerPoint,
  bounds:
    CreativeViewerBounds,
): CreativeViewerPoint {
  return {
    x:
      clampCreativeNumber(
        position.x,
        bounds.minX,
        bounds.maxX,
      ),

    y:
      clampCreativeNumber(
        position.y,
        bounds.minY,
        bounds.maxY,
      ),
  };
}

/* =========================================================
   CALCULAR PUNTO DEL CURSOR
   ========================================================= */

function getCreativeEventPoint(
  clientX:
    number,
  clientY:
    number,
  element:
    HTMLElement,
): CreativeViewerPoint {
  const rectangle =
    element.getBoundingClientRect();

  return {
    x:
      clientX -
      rectangle.left,

    y:
      clientY -
      rectangle.top,
  };
}

/* =========================================================
   POSICIÓN DESPUÉS DE CAMBIAR EL ZOOM
   ========================================================= */

function calculateCreativePositionAfterZoom(
  currentPosition:
    CreativeViewerPoint,
  currentScale:
    number,
  nextScale:
    number,
  focalPoint:
    CreativeViewerPoint | undefined,
  containerSize:
    CreativeViewerSize | null,
): CreativeViewerPoint {
  const safeCurrentScale =
    currentScale >
      0
      ? currentScale
      : 1;

  const scaleRatio =
    nextScale /
    safeCurrentScale;

  const containerCenter =
    containerSize
      ? {
          x:
            containerSize.width /
            2,

          y:
            containerSize.height /
            2,
        }
      : {
          ...EMPTY_CREATIVE_POINT,
        };

  const effectiveFocalPoint =
    focalPoint ??
    containerCenter;

  const relativeFocalPoint = {
    x:
      effectiveFocalPoint.x -
      containerCenter.x,

    y:
      effectiveFocalPoint.y -
      containerCenter.y,
  };

  return {
    x:
      relativeFocalPoint.x -
      (
        relativeFocalPoint.x -
        currentPosition.x
      ) *
      scaleRatio,

    y:
      relativeFocalPoint.y -
      (
        relativeFocalPoint.y -
        currentPosition.y
      ) *
      scaleRatio,
  };
}

/* =========================================================
   COMPROBAR SI PUEDE ARRASTRARSE
   ========================================================= */

function canCreativeImageBeDragged(
  bounds:
    CreativeViewerBounds | null,
): boolean {
  if (
    !bounds
  ) {
    return false;
  }

  return (
    bounds.maxX >
      CREATIVE_ZOOM_EPSILON ||
    bounds.maxY >
      CREATIVE_ZOOM_EPSILON
  );
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeZoom(
  options:
    UseCreativeZoomOptions = {},
): UseCreativeZoomResult {
  const {
    enabled =
      true,

    limits,

    initialScale,

    wheelZoomEnabled =
      true,

    wheelZoomSensitivity =
      CREATIVE_VIEWER.WHEEL_ZOOM_SENSITIVITY,

    dragEnabled =
      true,

    doubleClickZoomEnabled =
      true,

    doubleClickScale =
      CREATIVE_VIEWER.DOUBLE_CLICK_ZOOM,

    keyboardEnabled =
      true,

    transitionDurationMs =
      CREATIVE_VIEWER.TRANSITION_DURATION_MS,
  } =
    options;

  /* =======================================================
     VALORES INDIVIDUALES DE LOS LÍMITES
     ======================================================= */

  /*
   * Se extraen antes del useMemo.
   *
   * De esta manera, el callback del useMemo no utiliza el
   * objeto completo "limits" y la lista de dependencias es
   * exacta.
   */
  const requestedMinimum =
    limits?.minimum;

  const requestedMaximum =
    limits?.maximum;

  const requestedStep =
    limits?.step;

  const requestedDefaultScale =
    limits?.defaultScale;

  /* =======================================================
     CONFIGURACIÓN NORMALIZADA
     ======================================================= */

  const normalizedLimits =
    useMemo(
      () =>
        normalizeCreativeZoomLimits(
          requestedMinimum,
          requestedMaximum,
          requestedStep,
          requestedDefaultScale,
        ),
      [
        requestedMinimum,
        requestedMaximum,
        requestedStep,
        requestedDefaultScale,
      ],
    );

  const normalizedWheelSensitivity =
    useMemo(
      () => {
        if (
          typeof wheelZoomSensitivity !==
            "number" ||
          !Number.isFinite(
            wheelZoomSensitivity,
          ) ||
          wheelZoomSensitivity <=
            0
        ) {
          return CREATIVE_VIEWER.WHEEL_ZOOM_SENSITIVITY;
        }

        return wheelZoomSensitivity;
      },
      [
        wheelZoomSensitivity,
      ],
    );

  const normalizedDoubleClickScale =
    useMemo(
      () =>
        normalizeCreativeScale(
          doubleClickScale,
          normalizedLimits,
        ),
      [
        doubleClickScale,
        normalizedLimits,
      ],
    );

  const normalizedTransitionDuration =
    useMemo(
      () => {
        if (
          typeof transitionDurationMs !==
            "number" ||
          !Number.isFinite(
            transitionDurationMs,
          )
        ) {
          return CREATIVE_VIEWER.TRANSITION_DURATION_MS;
        }

        return Math.max(
          0,
          Math.trunc(
            transitionDurationMs,
          ),
        );
      },
      [
        transitionDurationMs,
      ],
    );

  /* =======================================================
     ESTADO DE TRANSFORMACIÓN
     ======================================================= */

  const [
    transform,
    setTransform,
  ] =
    useState<CreativeViewerTransformState>(
      () =>
        createInitialCreativeTransform(
          normalizedLimits,
          initialScale,
        ),
    );

  const transformRef =
    useRef<CreativeViewerTransformState>(
      transform,
    );

  /* =======================================================
     ELEMENTOS DEL VISOR
     ======================================================= */

  const [
    containerElement,
    setContainerElement,
  ] =
    useState<HTMLElement | null>(
      null,
    );

  const [
    mediaElement,
    setMediaElement,
  ] =
    useState<HTMLElement | null>(
      null,
    );

  const containerElementRef =
    useRef<HTMLElement | null>(
      null,
    );

  const mediaElementRef =
    useRef<HTMLElement | null>(
      null,
    );

  /* =======================================================
     MEDIDAS
     ======================================================= */

  const [
    containerSize,
    setContainerSize,
  ] =
    useState<CreativeViewerSize | null>(
      null,
    );

  const [
    mediaSize,
    setMediaSize,
  ] =
    useState<CreativeViewerSize | null>(
      null,
    );

  const containerSizeRef =
    useRef<CreativeViewerSize | null>(
      null,
    );

  const mediaSizeRef =
    useRef<CreativeViewerSize | null>(
      null,
    );

  /* =======================================================
     ACTUALIZAR TRANSFORMACIÓN
     ======================================================= */

  const commitTransform =
    useCallback(
      (
        updater:
          (
            currentTransform:
              CreativeViewerTransformState,
          ) => CreativeViewerTransformState,
      ): void => {
        setTransform(
          (
            currentTransform,
          ) => {
            const nextTransform =
              updater(
                currentTransform,
              );

            transformRef.current =
              nextTransform;

            return nextTransform;
          },
        );
      },
      [],
    );

  /* =======================================================
     REFERENCIAS DE ELEMENTOS
     ======================================================= */

  const containerRef =
    useCallback<
      RefCallback<HTMLElement>
    >(
      (
        node,
      ) => {
        containerElementRef.current =
          node;

        setContainerElement(
          node,
        );
      },
      [],
    );

  const mediaRef =
    useCallback<
      RefCallback<HTMLElement>
    >(
      (
        node,
      ) => {
        mediaElementRef.current =
          node;

        setMediaElement(
          node,
        );
      },
      [],
    );

  /* =======================================================
     MEDIR Y ACTUALIZAR LÍMITES
     ======================================================= */

  const refreshMeasurements =
    useCallback(
      (): void => {
        const nextContainerSize =
          measureCreativeElement(
            containerElementRef.current,
          );

        const nextMediaSize =
          measureCreativeElement(
            mediaElementRef.current,
          );

        if (
          !areCreativeSizesEqual(
            containerSizeRef.current,
            nextContainerSize,
          )
        ) {
          containerSizeRef.current =
            nextContainerSize;

          setContainerSize(
            nextContainerSize,
          );
        }

        if (
          !areCreativeSizesEqual(
            mediaSizeRef.current,
            nextMediaSize,
          )
        ) {
          mediaSizeRef.current =
            nextMediaSize;

          setMediaSize(
            nextMediaSize,
          );
        }

        const currentTransform =
          transformRef.current;

        const nextBounds =
          calculateCreativePanBounds(
            nextContainerSize,
            nextMediaSize,
            currentTransform.zoom.scale,
          );

        const nextPosition =
          clampCreativePanPosition(
            currentTransform.pan.position,
            nextBounds,
          );

        if (
          areCreativeBoundsEqual(
            currentTransform.pan.bounds,
            nextBounds,
          ) &&
          areCreativePointsEqual(
            currentTransform.pan.position,
            nextPosition,
          )
        ) {
          return;
        }

        commitTransform(
          (
            activeTransform,
          ) => ({
            ...activeTransform,

            pan: {
              ...activeTransform.pan,

              position:
                nextPosition,

              bounds:
                nextBounds,
            },
          }),
        );
      },
      [
        commitTransform,
      ],
    );

  /* =======================================================
     OBSERVAR CAMBIOS DE TAMAÑO
     ======================================================= */

  useEffect(
    () => {
      if (
        !containerElement ||
        !mediaElement
      ) {
        return;
      }

      const animationFrameId =
        window.requestAnimationFrame(
          () => {
            refreshMeasurements();
          },
        );

      if (
        typeof ResizeObserver ===
        "undefined"
      ) {
        return () => {
          window.cancelAnimationFrame(
            animationFrameId,
          );
        };
      }

      const resizeObserver =
        new ResizeObserver(
          () => {
            refreshMeasurements();
          },
        );

      resizeObserver.observe(
        containerElement,
      );

      resizeObserver.observe(
        mediaElement,
      );

      return () => {
        window.cancelAnimationFrame(
          animationFrameId,
        );

        resizeObserver.disconnect();
      };
    },
    [
      containerElement,
      mediaElement,
      refreshMeasurements,
    ],
  );

  /* =======================================================
     ACTUALIZAR CUANDO CAMBIAN LOS LÍMITES
     ======================================================= */

  useEffect(
    () => {
      const timeoutId =
        window.setTimeout(
          () => {
            const currentTransform =
              transformRef.current;

            const nextScale =
              normalizeCreativeScale(
                currentTransform.zoom.scale,
                normalizedLimits,
              );

            const nextBounds =
              calculateCreativePanBounds(
                containerSizeRef.current,
                mediaSizeRef.current,
                nextScale,
              );

            const nextPosition =
              clampCreativePanPosition(
                currentTransform.pan.position,
                nextBounds,
              );

            commitTransform(
              (
                activeTransform,
              ) => ({
                ...activeTransform,

                zoom:
                  createCreativeZoomState(
                    nextScale,
                    normalizedLimits,
                    Date.now(),
                  ),

                pan: {
                  ...activeTransform.pan,

                  position:
                    nextPosition,

                  bounds:
                    nextBounds,
                },
              }),
            );
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [
      commitTransform,
      normalizedLimits,
    ],
  );

  /* =======================================================
     APLICAR UNA ESCALA
     ======================================================= */

  const setZoom =
    useCallback(
      (
        requestedScale:
          number,
        focalPoint?:
          CreativeViewerPoint,
      ): void => {
        if (
          !enabled
        ) {
          return;
        }

        const updateTimestamp =
          Date.now();

        commitTransform(
          (
            currentTransform,
          ) => {
            const nextScale =
              normalizeCreativeScale(
                requestedScale,
                normalizedLimits,
              );

            const nextBounds =
              calculateCreativePanBounds(
                containerSizeRef.current,
                mediaSizeRef.current,
                nextScale,
              );

            const requestedPosition =
              calculateCreativePositionAfterZoom(
                currentTransform.pan.position,
                currentTransform.zoom.scale,
                nextScale,
                focalPoint,
                containerSizeRef.current,
              );

            const nextPosition =
              clampCreativePanPosition(
                requestedPosition,
                nextBounds,
              );

            return {
              ...currentTransform,

              zoom:
                createCreativeZoomState(
                  nextScale,
                  normalizedLimits,
                  updateTimestamp,
                ),

              pan: {
                ...currentTransform.pan,

                position:
                  nextPosition,

                bounds:
                  nextBounds,

                dragging:
                  false,

                pointerId:
                  null,

                pointerStart:
                  null,

                startPosition:
                  null,
              },

              transitionEnabled:
                true,
            };
          },
        );
      },
      [
        commitTransform,
        enabled,
        normalizedLimits,
      ],
    );

  /* =======================================================
     ACERCAR
     ======================================================= */

  const zoomIn =
    useCallback(
      (
        focalPoint?:
          CreativeViewerPoint,
      ): void => {
        const currentZoom =
          transformRef.current.zoom;

        if (
          !currentZoom.canZoomIn
        ) {
          return;
        }

        setZoom(
          currentZoom.scale +
          currentZoom.step,
          focalPoint,
        );
      },
      [
        setZoom,
      ],
    );

  /* =======================================================
     ALEJAR
     ======================================================= */

  const zoomOut =
    useCallback(
      (
        focalPoint?:
          CreativeViewerPoint,
      ): void => {
        const currentZoom =
          transformRef.current.zoom;

        if (
          !currentZoom.canZoomOut
        ) {
          return;
        }

        setZoom(
          currentZoom.scale -
          currentZoom.step,
          focalPoint,
        );
      },
      [
        setZoom,
      ],
    );

  /* =======================================================
     CAMBIAR POSICIÓN
     ======================================================= */

  const setPan =
    useCallback(
      (
        requestedPosition:
          CreativeViewerPoint,
      ): void => {
        if (
          !enabled ||
          !dragEnabled
        ) {
          return;
        }

        commitTransform(
          (
            currentTransform,
          ) => {
            const currentBounds =
              currentTransform.pan.bounds ??
              EMPTY_CREATIVE_BOUNDS;

            const nextPosition =
              clampCreativePanPosition(
                requestedPosition,
                currentBounds,
              );

            if (
              areCreativePointsEqual(
                currentTransform.pan.position,
                nextPosition,
              )
            ) {
              return currentTransform;
            }

            return {
              ...currentTransform,

              pan: {
                ...currentTransform.pan,

                position:
                  nextPosition,
              },

              transitionEnabled:
                false,
            };
          },
        );
      },
      [
        commitTransform,
        dragEnabled,
        enabled,
      ],
    );

  /* =======================================================
     CENTRAR IMAGEN
     ======================================================= */

  const centerImage =
    useCallback(
      (): void => {
        commitTransform(
          (
            currentTransform,
          ) => ({
            ...currentTransform,

            pan: {
              ...currentTransform.pan,

              position: {
                ...EMPTY_CREATIVE_POINT,
              },

              dragging:
                false,

              hasMoved:
                false,

              pointerId:
                null,

              pointerStart:
                null,

              startPosition:
                null,
            },

            transitionEnabled:
              true,
          }),
        );
      },
      [
        commitTransform,
      ],
    );

  /* =======================================================
     RESTABLECER TRANSFORMACIÓN
     ======================================================= */

  const resetTransform =
    useCallback(
      (): void => {
        const defaultScale =
          normalizedLimits.defaultScale;

        const defaultBounds =
          calculateCreativePanBounds(
            containerSizeRef.current,
            mediaSizeRef.current,
            defaultScale,
          );

        commitTransform(
          (
            currentTransform,
          ) => ({
            ...currentTransform,

            zoom:
              createCreativeZoomState(
                defaultScale,
                normalizedLimits,
                Date.now(),
              ),

            pan: {
              ...createCreativePanState(),

              bounds:
                defaultBounds,
            },

            transformOrigin: {
              x: 0.5,
              y: 0.5,
            },

            transitionEnabled:
              true,
          }),
        );
      },
      [
        commitTransform,
        normalizedLimits,
      ],
    );

  /* =======================================================
     RUEDA DEL MOUSE
     ======================================================= */

  const handleWheel =
    useCallback(
      (
        event:
          ReactWheelEvent<HTMLElement>,
      ): void => {
        if (
          !enabled ||
          !wheelZoomEnabled ||
          event.deltaY ===
            0
        ) {
          return;
        }

        event.preventDefault();

        const currentScale =
          transformRef.current.zoom.scale;

        const nextScale =
          currentScale *
          Math.exp(
            -event.deltaY *
            normalizedWheelSensitivity,
          );

        const focalPoint =
          getCreativeEventPoint(
            event.clientX,
            event.clientY,
            event.currentTarget,
          );

        setZoom(
          nextScale,
          focalPoint,
        );
      },
      [
        enabled,
        normalizedWheelSensitivity,
        setZoom,
        wheelZoomEnabled,
      ],
    );

  /* =======================================================
     DOBLE CLIC
     ======================================================= */

  const handleDoubleClick =
    useCallback(
      (
        event:
          ReactMouseEvent<HTMLElement>,
      ): void => {
        if (
          !enabled ||
          !doubleClickZoomEnabled
        ) {
          return;
        }

        event.preventDefault();

        const currentZoom =
          transformRef.current.zoom;

        const nextScale =
          currentZoom.isDefault
            ? normalizedDoubleClickScale
            : normalizedLimits.defaultScale;

        const focalPoint =
          getCreativeEventPoint(
            event.clientX,
            event.clientY,
            event.currentTarget,
          );

        setZoom(
          nextScale,
          focalPoint,
        );
      },
      [
        doubleClickZoomEnabled,
        enabled,
        normalizedDoubleClickScale,
        normalizedLimits.defaultScale,
        setZoom,
      ],
    );

  /* =======================================================
     INICIAR ARRASTRE
     ======================================================= */

  const handlePointerDown =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        const currentTransform =
          transformRef.current;

        if (
          !enabled ||
          !dragEnabled ||
          !event.isPrimary ||
          (
            event.pointerType ===
              "mouse" &&
            event.button !==
              0
          ) ||
          !canCreativeImageBeDragged(
            currentTransform.pan.bounds,
          )
        ) {
          return;
        }

        event.preventDefault();

        event.currentTarget.setPointerCapture(
          event.pointerId,
        );

        const pointerStart:
          CreativeViewerPoint = {
            x:
              event.clientX,

            y:
              event.clientY,
          };

        commitTransform(
          (
            activeTransform,
          ) => ({
            ...activeTransform,

            pan: {
              ...activeTransform.pan,

              startPosition: {
                ...activeTransform.pan.position,
              },

              pointerStart,

              dragging:
                true,

              hasMoved:
                false,

              pointerId:
                event.pointerId,
            },

            transitionEnabled:
              false,
          }),
        );
      },
      [
        commitTransform,
        dragEnabled,
        enabled,
      ],
    );

  /* =======================================================
     MOVER DURANTE EL ARRASTRE
     ======================================================= */

  const handlePointerMove =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        const currentTransform =
          transformRef.current;

        const {
          pan,
        } =
          currentTransform;

        if (
          !enabled ||
          !dragEnabled ||
          !pan.dragging ||
          pan.pointerId !==
            event.pointerId ||
          !pan.pointerStart ||
          !pan.startPosition
        ) {
          return;
        }

        event.preventDefault();

        const deltaX =
          event.clientX -
          pan.pointerStart.x;

        const deltaY =
          event.clientY -
          pan.pointerStart.y;

        const requestedPosition:
          CreativeViewerPoint = {
            x:
              pan.startPosition.x +
              deltaX,

            y:
              pan.startPosition.y +
              deltaY,
          };

        const currentBounds =
          pan.bounds ??
          EMPTY_CREATIVE_BOUNDS;

        const nextPosition =
          clampCreativePanPosition(
            requestedPosition,
            currentBounds,
          );

        const movementDistance =
          Math.hypot(
            deltaX,
            deltaY,
          );

        const hasMoved =
          pan.hasMoved ||
          movementDistance >=
            CREATIVE_VIEWER.MINIMUM_DRAG_DISTANCE_PX;

        commitTransform(
          (
            activeTransform,
          ) => ({
            ...activeTransform,

            pan: {
              ...activeTransform.pan,

              position:
                nextPosition,

              hasMoved,
            },

            transitionEnabled:
              false,
          }),
        );
      },
      [
        commitTransform,
        dragEnabled,
        enabled,
      ],
    );

  /* =======================================================
     FINALIZAR ARRASTRE
     ======================================================= */

  const finishPointerInteraction =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        const currentPointerId =
          transformRef.current.pan.pointerId;

        if (
          currentPointerId !==
          event.pointerId
        ) {
          return;
        }

        if (
          event.currentTarget.hasPointerCapture(
            event.pointerId,
          )
        ) {
          event.currentTarget.releasePointerCapture(
            event.pointerId,
          );
        }

        commitTransform(
          (
            currentTransform,
          ) => ({
            ...currentTransform,

            pan: {
              ...currentTransform.pan,

              dragging:
                false,

              pointerId:
                null,

              pointerStart:
                null,

              startPosition:
                null,
            },

            transitionEnabled:
              true,
          }),
        );
      },
      [
        commitTransform,
      ],
    );

  const handlePointerUp =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        finishPointerInteraction(
          event,
        );
      },
      [
        finishPointerInteraction,
      ],
    );

  const handlePointerCancel =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        finishPointerInteraction(
          event,
        );
      },
      [
        finishPointerInteraction,
      ],
    );

  const handleLostPointerCapture =
    useCallback(
      (
        event:
          ReactPointerEvent<HTMLElement>,
      ): void => {
        const currentPointerId =
          transformRef.current.pan.pointerId;

        if (
          currentPointerId !==
          event.pointerId
        ) {
          return;
        }

        commitTransform(
          (
            currentTransform,
          ) => ({
            ...currentTransform,

            pan: {
              ...currentTransform.pan,

              dragging:
                false,

              pointerId:
                null,

              pointerStart:
                null,

              startPosition:
                null,
            },

            transitionEnabled:
              true,
          }),
        );
      },
      [
        commitTransform,
      ],
    );

  /* =======================================================
     TECLADO
     ======================================================= */

  const handleKeyDown =
    useCallback(
      (
        event:
          ReactKeyboardEvent<HTMLElement>,
      ): void => {
        if (
          !enabled ||
          !keyboardEnabled
        ) {
          return;
        }

        const normalizedKey =
          event.key.toLowerCase();

        const zoomInRequested =
          event.key ===
            CREATIVE_VIEWER_KEYS.ZOOM_IN ||
          event.key ===
            CREATIVE_VIEWER_KEYS.ZOOM_IN_ALTERNATIVE ||
          event.code ===
            "NumpadAdd";

        const zoomOutRequested =
          event.key ===
            CREATIVE_VIEWER_KEYS.ZOOM_OUT ||
          event.code ===
            "NumpadSubtract";

        const resetRequested =
          event.key ===
            CREATIVE_VIEWER_KEYS.RESET ||
          event.code ===
            "Numpad0";

        if (
          zoomInRequested
        ) {
          event.preventDefault();

          zoomIn();

          return;
        }

        if (
          zoomOutRequested
        ) {
          event.preventDefault();

          zoomOut();

          return;
        }

        if (
          resetRequested
        ) {
          event.preventDefault();

          resetTransform();

          return;
        }

        if (
          normalizedKey ===
          "z"
        ) {
          event.preventDefault();

          zoomIn();

          return;
        }

        if (
          normalizedKey ===
          "r"
        ) {
          event.preventDefault();

          resetTransform();
        }
      },
      [
        enabled,
        keyboardEnabled,
        resetTransform,
        zoomIn,
        zoomOut,
      ],
    );

  /* =======================================================
     ESTILO CSS
     ======================================================= */

  const canDrag =
    dragEnabled &&
    enabled &&
    canCreativeImageBeDragged(
      transform.pan.bounds,
    );

  const mediaStyle =
    useMemo<CSSProperties>(
      () => ({
        transform:
          `translate3d(${transform.pan.position.x}px, ${transform.pan.position.y}px, 0) scale(${transform.zoom.scale})`,

        transformOrigin:
          `${transform.transformOrigin.x * 100}% ${transform.transformOrigin.y * 100}%`,

        transition:
          transform.transitionEnabled &&
          !transform.pan.dragging
            ? `transform ${normalizedTransitionDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : "none",

        cursor:
          transform.pan.dragging
            ? "grabbing"
            : canDrag
              ? "grab"
              : "zoom-in",

        touchAction:
          canDrag
            ? "none"
            : "manipulation",

        userSelect:
          "none",

        willChange:
          "transform",

        WebkitUserDrag:
          "none",
      }),
      [
        canDrag,
        normalizedTransitionDuration,
        transform,
      ],
    );

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    transform,

    zoom:
      transform.zoom,

    pan:
      transform.pan,

    scale:
      transform.zoom.scale,

    percentage:
      transform.zoom.percentage,

    position:
      transform.pan.position,

    bounds:
      transform.pan.bounds ??
      EMPTY_CREATIVE_BOUNDS,

    containerSize,

    mediaSize,

    enabled,

    dragging:
      transform.pan.dragging,

    hasMoved:
      transform.pan.hasMoved,

    canZoomIn:
      transform.zoom.canZoomIn,

    canZoomOut:
      transform.zoom.canZoomOut,

    canDrag,

    isDefault:
      transform.zoom.isDefault,

    containerRef,

    mediaRef,

    mediaStyle,

    zoomIn,

    zoomOut,

    setZoom,

    setPan,

    centerImage,

    resetTransform,

    refreshMeasurements,

    handleWheel,

    handleDoubleClick,

    handlePointerDown,

    handlePointerMove,

    handlePointerUp,

    handlePointerCancel,

    handleLostPointerCapture,

    handleKeyDown,
  };
}