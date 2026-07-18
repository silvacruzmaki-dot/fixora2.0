"use client";

import {
  useCallback,
  useRef,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";

import type { UseRadialRotationReturn } from "@/types/floating-menu/floatingMenu.types";

const ROTATION_STEP = 60;
const WHEEL_DELAY = 180;
const TOUCH_THRESHOLD = 18;

function normalizeRotation(value: number): number {
  return ((value % 360) + 360) % 360;
}

export default function useRadialRotation(): UseRadialRotationReturn {
  const [rotation, setRotation] = useState(0);

  const lastWheelTimeRef = useRef(0);
  const touchPositionRef = useRef<number | null>(null);

  const rotateMenu = useCallback((direction: number): void => {
    if (direction === 0) {
      return;
    }

    const normalizedDirection = direction > 0 ? 1 : -1;

    setRotation((currentRotation) =>
      normalizeRotation(
        currentRotation + normalizedDirection * ROTATION_STEP,
      ),
    );
  }, []);

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLElement>): void => {
      event.preventDefault();
      event.stopPropagation();

      const currentTime = Date.now();

      if (
        currentTime - lastWheelTimeRef.current <
        WHEEL_DELAY
      ) {
        return;
      }

      lastWheelTimeRef.current = currentTime;

      if (event.deltaY > 0) {
        rotateMenu(1);
      } else if (event.deltaY < 0) {
        rotateMenu(-1);
      }
    },
    [rotateMenu],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLElement>): void => {
      const firstTouch = event.touches.item(0);

      if (!firstTouch) {
        return;
      }

      touchPositionRef.current = firstTouch.clientY;
    },
    [],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent<HTMLElement>): void => {
      const firstTouch = event.touches.item(0);
      const previousPosition = touchPositionRef.current;

      if (!firstTouch || previousPosition === null) {
        return;
      }

      const currentPosition = firstTouch.clientY;
      const movement = previousPosition - currentPosition;

      if (Math.abs(movement) < TOUCH_THRESHOLD) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      rotateMenu(movement > 0 ? 1 : -1);

      touchPositionRef.current = currentPosition;
    },
    [rotateMenu],
  );

  return {
    rotation,
    rotateMenu,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
  };
}