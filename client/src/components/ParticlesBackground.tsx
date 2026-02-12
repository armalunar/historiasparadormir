import { useMemo } from "react";
import Particles from "@tsparticles/react";

interface ParticlesBackgroundProps {
  enabled?: boolean;
}

export function ParticlesBackground({ enabled = true }: ParticlesBackgroundProps) {
  const options = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.3,
          },
        },
      },
    },
    particles: {
      color: {
        value: ["#b794f6", "#f6b1cc", "#ffd88a"],
      },
      links: {
        color: "#b794f6",
        distance: 150,
        enable: false,
        opacity: 0.15,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 0.8,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 2, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
    },
    detectRetina: true,
  }) as any, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ overflow: 'hidden' }}>
      <Particles
        id="tsparticles"
        options={options}
      />
    </div>
  );
}
