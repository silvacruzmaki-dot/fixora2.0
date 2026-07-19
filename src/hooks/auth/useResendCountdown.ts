"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface UseResendCountdownOptions {
  initialSeconds?: number;

  autoStart?: boolean;

  onTick?: (
    secondsRemaining: number,
  ) => void;

  onComplete?: () => void;
}

export interface UseResendCountdownResult {
  secondsRemaining: number;

  minutes: number;
  seconds: number;

  formattedTime: string;

  totalSeconds: number;
  remainingPercentage: number;

  isRunning: boolean;
  isPaused: boolean;
  canResend: boolean;

  start: (
    seconds?: number,
  ) => void;

  reset: (
    seconds?: number,
  ) => void;

  pause: () => void;
  resume: () => void;

  finish: () => void;
}

const COUNTDOWN_INTERVAL_MS =
  250;

function normalizeSeconds(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

function calculateRemainingSeconds(
  deadline: number,
): number {
  return Math.max(
    0,
    Math.ceil(
      (
        deadline -
        Date.now()
      ) / 1_000,
    ),
  );
}

function formatCountdownTime(
  secondsRemaining: number,
): string {
  const minutes =
    Math.floor(
      secondsRemaining /
        60,
    );

  const seconds =
    secondsRemaining %
    60;

  return `${String(
    minutes,
  ).padStart(
    2,
    "0",
  )}:${String(
    seconds,
  ).padStart(
    2,
    "0",
  )}`;
}

export function useResendCountdown({
  initialSeconds = 0,

  autoStart = true,

  onTick,
  onComplete,
}: UseResendCountdownOptions = {}): UseResendCountdownResult {
  const normalizedInitialSeconds =
    normalizeSeconds(
      initialSeconds,
    );

  const [
    secondsRemaining,
    setSecondsRemaining,
  ] = useState<number>(
    normalizedInitialSeconds,
  );

  const [
    totalSeconds,
    setTotalSeconds,
  ] = useState<number>(
    normalizedInitialSeconds,
  );

  /*
   * La fecha límite se establece directamente
   * en el estado inicial. De esta manera no es
   * necesario ejecutar setState dentro de un
   * useEffect para iniciar el contador.
   */
  const [
    deadline,
    setDeadline,
  ] = useState<number | null>(
    () => {
      if (
        !autoStart ||
        normalizedInitialSeconds <=
          0
      ) {
        return null;
      }

      return (
        Date.now() +
        normalizedInitialSeconds *
          1_000
      );
    },
  );

  const intervalRef =
    useRef<number | null>(
      null,
    );

  const lastTickValueRef =
    useRef<number>(
      normalizedInitialSeconds,
    );

  const completionNotifiedRef =
    useRef<boolean>(
      false,
    );

  const onTickRef =
    useRef<
      UseResendCountdownOptions["onTick"]
    >(onTick);

  const onCompleteRef =
    useRef<
      UseResendCountdownOptions["onComplete"]
    >(onComplete);

  /*
   * Conservamos siempre las funciones más recientes
   * sin reiniciar el intervalo cuando cambian.
   */
  useEffect(() => {
    onTickRef.current =
      onTick;
  }, [onTick]);

  useEffect(() => {
    onCompleteRef.current =
      onComplete;
  }, [onComplete]);

  const clearIntervalTimer =
    useCallback(() => {
      if (
        intervalRef.current ===
        null
      ) {
        return;
      }

      window.clearInterval(
        intervalRef.current,
      );

      intervalRef.current =
        null;
    }, []);

  const notifyTick =
    useCallback(
      (
        nextSeconds: number,
      ) => {
        if (
          lastTickValueRef.current ===
          nextSeconds
        ) {
          return;
        }

        lastTickValueRef.current =
          nextSeconds;

        onTickRef.current?.(
          nextSeconds,
        );
      },
      [],
    );

  const notifyCompletion =
    useCallback(() => {
      if (
        completionNotifiedRef.current
      ) {
        return;
      }

      completionNotifiedRef.current =
        true;

      onCompleteRef.current?.();
    }, []);

  const beginCountdown =
    useCallback(
      (
        requestedSeconds: number,
      ) => {
        const safeSeconds =
          normalizeSeconds(
            requestedSeconds,
          );

        clearIntervalTimer();

        completionNotifiedRef.current =
          false;

        lastTickValueRef.current =
          safeSeconds;

        setTotalSeconds(
          safeSeconds,
        );

        setSecondsRemaining(
          safeSeconds,
        );

        if (
          safeSeconds <= 0
        ) {
          setDeadline(
            null,
          );

          return;
        }

        setDeadline(
          Date.now() +
            safeSeconds *
              1_000,
        );
      },
      [clearIntervalTimer],
    );

  const start =
    useCallback(
      (
        seconds =
          normalizedInitialSeconds,
      ) => {
        beginCountdown(
          seconds,
        );
      },
      [
        beginCountdown,
        normalizedInitialSeconds,
      ],
    );

  const reset =
    useCallback(
      (
        seconds =
          normalizedInitialSeconds,
      ) => {
        beginCountdown(
          seconds,
        );
      },
      [
        beginCountdown,
        normalizedInitialSeconds,
      ],
    );

  const pause =
    useCallback(() => {
      if (
        deadline === null
      ) {
        return;
      }

      const remaining =
        calculateRemainingSeconds(
          deadline,
        );

      clearIntervalTimer();

      lastTickValueRef.current =
        remaining;

      setSecondsRemaining(
        remaining,
      );

      setDeadline(
        null,
      );
    }, [
      clearIntervalTimer,
      deadline,
    ]);

  const resume =
    useCallback(() => {
      if (
        deadline !== null ||
        secondsRemaining <= 0
      ) {
        return;
      }

      completionNotifiedRef.current =
        false;

      lastTickValueRef.current =
        secondsRemaining;

      setDeadline(
        Date.now() +
          secondsRemaining *
            1_000,
      );
    }, [
      deadline,
      secondsRemaining,
    ]);

  const finish =
    useCallback(() => {
      clearIntervalTimer();

      setDeadline(
        null,
      );

      setSecondsRemaining(
        0,
      );

      notifyTick(
        0,
      );

      notifyCompletion();
    }, [
      clearIntervalTimer,
      notifyCompletion,
      notifyTick,
    ]);

  /*
   * Este efecto solamente registra el intervalo.
   * No ejecuta setState directamente al comenzar.
   * Las actualizaciones ocurren dentro del callback
   * del intervalo.
   */
  useEffect(() => {
    if (
      deadline === null
    ) {
      return;
    }

    const updateCountdown =
      () => {
        const nextSeconds =
          calculateRemainingSeconds(
            deadline,
          );

        setSecondsRemaining(
          nextSeconds,
        );

        notifyTick(
          nextSeconds,
        );

        if (
          nextSeconds <= 0
        ) {
          clearIntervalTimer();

          setDeadline(
            null,
          );

          notifyCompletion();
        }
      };

    intervalRef.current =
      window.setInterval(
        updateCountdown,
        COUNTDOWN_INTERVAL_MS,
      );

    return () => {
      clearIntervalTimer();
    };
  }, [
    clearIntervalTimer,
    deadline,
    notifyCompletion,
    notifyTick,
  ]);

  /*
   * Cuando el navegador vuelve a estar visible,
   * recalculamos el tiempo usando la fecha límite
   * real. Esto evita que el contador se atrase
   * cuando la pestaña queda en segundo plano.
   */
  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState !==
            "visible" ||
          deadline === null
        ) {
          return;
        }

        const nextSeconds =
          calculateRemainingSeconds(
            deadline,
          );

        setSecondsRemaining(
          nextSeconds,
        );

        notifyTick(
          nextSeconds,
        );

        if (
          nextSeconds <= 0
        ) {
          clearIntervalTimer();

          setDeadline(
            null,
          );

          notifyCompletion();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [
    clearIntervalTimer,
    deadline,
    notifyCompletion,
    notifyTick,
  ]);

  /*
   * Limpieza final al desmontar el componente.
   */
  useEffect(() => {
    return () => {
      clearIntervalTimer();
    };
  }, [clearIntervalTimer]);

  const minutes =
    Math.floor(
      secondsRemaining /
        60,
    );

  const seconds =
    secondsRemaining %
    60;

  const formattedTime =
    useMemo(
      () =>
        formatCountdownTime(
          secondsRemaining,
        ),
      [secondsRemaining],
    );

  const remainingPercentage =
    useMemo(() => {
      if (
        totalSeconds <= 0
      ) {
        return 0;
      }

      return Math.min(
        100,
        Math.max(
          0,
          (
            secondsRemaining /
            totalSeconds
          ) * 100,
        ),
      );
    }, [
      secondsRemaining,
      totalSeconds,
    ]);

  const isRunning =
    deadline !== null &&
    secondsRemaining > 0;

  const isPaused =
    deadline === null &&
    secondsRemaining > 0;

  const canResend =
    secondsRemaining <= 0;

  return {
    secondsRemaining,

    minutes,
    seconds,

    formattedTime,

    totalSeconds,
    remainingPercentage,

    isRunning,
    isPaused,
    canResend,

    start,
    reset,

    pause,
    resume,

    finish,
  };
}