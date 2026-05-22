# ECCS Cards — Guía de diseño y replicación

Documento de referencia para replicar el patrón de cards de navegación usado en los módulos de inicio de las apps ECCS.

---

## Resultado visual

Cada card tiene:
- Un **banner superior** con gradiente de color y un ícono centrado dentro de un círculo semitransparente
- Un **título** y **descripción** en el cuerpo
- Un **footer** con un tag identificador y un botón de flecha
- Efecto **tilt 3D** que sigue el cursor al hacer hover (estilo Apple)
- Animación de **entrada** con fade + translateY al cargar la página

---

## 1. CSS global — `styles.css`

Estas clases ya están en el `styles.css` global del proyecto. **No las copies en el CSS local del componente.**

```css
/* Card base */
.rh-card {
  overflow:    hidden;
  cursor:      pointer;
  will-change: transform;
  transition:  transform 0.12s ease, box-shadow 0.15s ease;
}

.rh-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15) !important;
}

/* Banner superior */
.rh-banner {
  height:          140px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.rh-card:hover .rh-banner {
  transform: scale(1.04);
}

/* Círculo contenedor del ícono */
.rh-icon-wrap {
  width:           7rem;
  height:          7rem;
  border-radius:   50%;
  background:      rgba(255, 255, 255, 0.2);
  display:         flex;
  align-items:     center;
  justify-content: center;
  transition:      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.rh-card:hover .rh-icon-wrap {
  transform: scale(1.15) rotate(-4deg);
}

/* Ícono */
.rh-icon {
  font-size: 3.5rem !important;
  color:     #fff;
  line-height: 1;
}

.rh-icon::before {
  font-size: 3.5rem !important;
}
```

> Si el módulo usa colores de banner fijos (no dinámicos), agrégalos en el CSS **local** del componente:
> ```css
> .rh-blue   { background: linear-gradient(135deg, #1d4ed8, #3b82f6); }
> .rh-purple { background: linear-gradient(135deg, #6d28d9, #a78bfa); }
> .rh-orange { background: linear-gradient(135deg, #c2410c, #fb923c); }
> .rh-green  { background: linear-gradient(135deg, #15803d, #4ade80); }
> .rh-red    { background: linear-gradient(135deg, #b91c1c, #f87171); }
> ```

---

## 2. Interfaz TypeScript

Define la interfaz `CardMenu` en el `.ts` del componente:

```ts
interface CardMenu {
  titulo:      string;
  descripcion: string;
  icono:       string;                  // clase PrimeNG, ej: 'pi pi-calculator'
  color:       string;                  // gradiente CSS, ej: 'linear-gradient(135deg, #15803d, #4ade80)'
  tag:         string;
  tagSeverity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
  tagIcono:    string;
  ruta:        string | null;           // null = muestra toast "en desarrollo"
}
```

---

## 3. Array de cards

```ts
public cards: CardMenu[] = [
  {
    titulo:      'Mi Módulo',
    descripcion: 'Descripción corta del módulo',
    icono:       'pi pi-calculator',
    color:       'linear-gradient(135deg, #c2410c, #fb923c)',
    tag:         'Etiqueta',
    tagSeverity: 'warn',
    tagIcono:    'pi pi-clock',
    ruta:        '/mi-app/mi-modulo',   // null si aún no existe
  },
  // ... más cards
];
```

---

## 4. Métodos requeridos en el `.ts`

### Tilt 3D (efecto hover que sigue el cursor)

```ts
public onTilt(e: MouseEvent): void {
  const el = (e.currentTarget as HTMLElement).querySelector('.rh-card') as HTMLElement;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
  const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
  el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
}

public onTiltReset(e: MouseEvent): void {
  const el = (e.currentTarget as HTMLElement).querySelector('.rh-card') as HTMLElement;
  if (!el) return;
  el.style.transform = '';
}
```

### Navegación

```ts
public navegarCard(card: CardMenu): void {
  if (card.ruta === null) {
    this.messageService.add({
      key: 'tc', severity: 'warn',
      summary: 'En desarrollo 🚧',
      detail: `"${card.titulo}" estará disponible próximamente`,
      life: 3000
    });
    return;
  }
  this.router.navigate([card.ruta]);
}
```

---

## 5. Template HTML

```html
<div class="grid">

  @for (card of cards; track card.titulo) {
    <div class="fade-in col-12 md:col-6 lg:col-4"
         (click)="navegarCard(card)"
         (mousemove)="onTilt($event)"
         (mouseleave)="onTiltReset($event)">

      <p-card styleClass="rh-card">

        <ng-template #header>
          <div class="rh-banner" [ngStyle]="{'background': card.color}">
            <div class="rh-icon-wrap">
              <i class="{{ card.icono }} rh-icon"></i>
            </div>
          </div>
        </ng-template>

        <div class="text-xl font-bold mb-1">{{ card.titulo }}</div>
        <div class="font-bold text-sm mb-3">{{ card.descripcion }}</div>

        <ng-template #footer>
          <div class="flex align-items-center justify-content-between">
            <p-tag [value]="card.tag" [severity]="card.tagSeverity" [icon]="card.tagIcono" />
            <p-button icon="pi pi-arrow-right" [rounded]="true" [text]="true" severity="secondary" />
          </div>
        </ng-template>

      </p-card>
    </div>
  }

</div>
```

> Si los colores del banner son **fijos** (no vienen del array), usa clases directas en lugar de `[ngStyle]`:
> ```html
> <div class="rh-banner rh-blue">
> ```

---

## 6. Header del módulo (opcional)

Si quieres el header con animación de entrada desde la izquierda, agrega en el CSS **local**:

```css
@keyframes headerEntrada {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.header-entrada {
  animation: headerEntrada 0.5s cubic-bezier(0.25, 1, 0.5, 1) both;
}
```

Y en el HTML:

```html
<div class="header-entrada flex align-items-center justify-content-between mb-3">
  <div class="flex align-items-center gap-3">
    <p-avatar label="🛒" size="xlarge" shape="circle" />
    <div>
      <div class="text-3xl font-bold">Nombre del Módulo</div>
      <div class="font-bold text-sm" style="text-transform:capitalize">{{ hoy() }}</div>
    </div>
  </div>
  <p-tag value="Mi Panel" severity="success" icon="pi pi-star" />
</div>

<p-divider />
```

---

## 7. Imports necesarios en el `.ts`

```ts
import { CommonModule }   from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import ImportsModule from '@shared/primeng/ImportsModule';
```

---

## Checklist para nueva app

- [ ] Copiar la interfaz `CardMenu` al `.ts`
- [ ] Definir el array `cards[]` con los módulos del app
- [ ] Agregar `onTilt`, `onTiltReset` y `navegarCard` al `.ts`
- [ ] Pegar el template HTML del grid de cards
- [ ] Verificar que `styles.css` global tenga las clases `rh-*`
- [ ] Si usa colores fijos, agregar `.rh-blue`, `.rh-green`, etc. en el CSS local
- [ ] Si quiere header animado, agregar `.header-entrada` en el CSS local
