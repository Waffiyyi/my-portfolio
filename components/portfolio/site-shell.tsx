"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { site } from "@/data/site";
import { Reveal } from "./motion";
import { CursorEffect } from "./cursor-effect";
const TransitionContext = createContext<(href: string) => void>(() => {});
export function MotionLink({
  href,
  children,
  className = "",
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  const navigate = useContext(TransitionContext);
  return (
    <Link
      href={href}
      className={className}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (
          !e.defaultPrevented &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey &&
          e.button === 0 &&
          href.startsWith("/") &&
          !href.endsWith(".pdf")
        ) {
          e.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </Link>
  );
}
function Clock() {
  const [time, setTime] = useState("WAT");
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Africa/Lagos",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="local-clock">
      <i /> Lagos, NG <span>{time}</span>
    </span>
  );
}
function Loader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  useEffect(() => {
    if (!visible) window.dispatchEvent(new Event("wf:ready"));
  }, [visible]);
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("wf-ready")
    ) {
      setVisible(false);
      return;
    }
    setProgress(25);
    let alive = true;
    let tween: gsap.core.Tween | undefined;
    const finish = () => {
      if (!alive || finished.current) return;
      finished.current = true;
      setProgress(100);
      sessionStorage.setItem("wf-ready", "1");
      tween = gsap.to(root.current, {
        yPercent: -100,
        duration: 0.45,
        delay: 0.12,
        ease: "power3.inOut",
        onComplete: () => setVisible(false),
      });
    };
    const timer = setTimeout(finish, 1600);
    Promise.all([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 350)),
    ]).then(() => {
      if (alive) {
        clearTimeout(timer);
        setProgress(75);
        finish();
      }
    });
    return () => {
      alive = false;
      clearTimeout(timer);
      tween?.kill();
    };
  }, []);
  if (!visible) return null;
  return (
    <div
      ref={root}
      className="loader"
      role="status"
      aria-label="Preparing portfolio"
    >
      <svg viewBox="0 0 180 100" aria-hidden="true">
        <path
          pathLength="1"
          d="M10 20 30 80 50 35 70 80 90 20m20 60V20h60m-60 27h43"
        />
      </svg>
      <span className="eyebrow">Waffiyyi Fashola / Lagos</span>
      <span className="loader-count">
        {progress}
        <small>%</small>
      </span>
      <button
        onClick={() => {
          finished.current = true;
          gsap.killTweensOf(root.current);
          sessionStorage.setItem("wf-ready", "1");
          setVisible(false);
        }}
      >
        Skip intro ↗
      </button>
    </div>
  );
}
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const cover = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(pathname);
  const closeMenu = useCallback(() => {
    menu.current?.close();
    setMenuOpen(false);
    menuButton.current?.focus();
  }, []);
  const navigate = useCallback(
    (href: string) => {
      const current = location.pathname + location.search;
      if (href === current) {
        closeMenu();
        return;
      }
      closeMenu();
      if (new URL(href, location.href).pathname === location.pathname) {
        router.push(href);
        return;
      }
      if (timeout.current) clearTimeout(timeout.current);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      busy.current = true;
      gsap.killTweensOf(cover.current);
      gsap.set(cover.current, { yPercent: 100, visibility: "visible" });
      gsap.to(cover.current, {
        yPercent: 0,
        duration: 0.28,
        ease: "power2.inOut",
        onComplete: () => router.push(href),
      });
      timeout.current = setTimeout(() => {
        busy.current = false;
        gsap.to(cover.current, {
          yPercent: -100,
          duration: 0.35,
          onComplete: () => gsap.set(cover.current, { visibility: "hidden" }),
        });
      }, 2000);
    },
    [closeMenu, router],
  );
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (timeout.current) clearTimeout(timeout.current);
    busy.current = false;
    gsap.to(cover.current, {
      yPercent: -100,
      duration: 0.45,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(cover.current, { visibility: "hidden" });
        document
          .querySelector<HTMLElement>("main")
          ?.focus({ preventScroll: true });
      },
    });
  }, [pathname]);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
      gsap.killTweensOf(cover.current);
    },
    [],
  );
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <TransitionContext.Provider value={navigate}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <MotionLink href="/" className="wordmark">
          <span className="mark">w/f</span>
          <span className="wordmark-name">
            WAFFIYYI
            <br />
            FASHOLA
          </span>
        </MotionLink>
        <nav className="desktop-nav" aria-label="Main navigation">
          {[
            ["/", "Index"],
            ["/work", "Work"],
            ["/about", "About"],
            ["/contact", "Contact"],
          ].map(([href, label], i) => (
            <MotionLink
              key={href}
              href={href}
              aria-current={
                pathname === href ||
                (href === "/work" && pathname.startsWith("/work/"))
                  ? "page"
                  : undefined
              }
            >
              <sup>0{i + 1}</sup>
              {label}
            </MotionLink>
          ))}
        </nav>
        <Clock />
        <button
          ref={menuButton}
          className="menu-button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => {
            menu.current?.showModal();
            setMenuOpen(true);
          }}
        >
          <span /> <span />
        </button>
      </header>
      <dialog
        ref={menu}
        className="nav-dialog"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = menu.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex="0"]',
          );
          if (!controls?.length) return;
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClick={(e) => {
          if (e.target === menu.current) closeMenu();
        }}
        aria-label="Navigation menu"
      >
        <div className="nav-dialog-top">
          <span className="eyebrow">Waffiyyi Fashola</span>
          <button onClick={closeMenu} aria-label="Close menu">
            Close ×
          </button>
        </div>
        <nav aria-label="Expanded navigation">
          {[
            ["/", "Index"],
            ["/work", "Work"],
            ["/about", "About"],
            ["/contact", "Contact"],
          ].map(([href, label], i) => (
            <MotionLink key={href} href={href}>
              <span className="mono">0{i + 1}</span>
              {label}
              <span aria-hidden="true">↗</span>
            </MotionLink>
          ))}
        </nav>
        <a className="menu-email" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <div className="social-row">
          <a href={site.github}>GitHub ↗</a>
          <a href={site.linkedin}>LinkedIn ↗</a>
          <a href={site.resume}>Résumé ↗</a>
        </div>
      </dialog>
      {children}
      <Footer />
      <div ref={cover} className="route-cover" aria-hidden="true">
        <span>w/f</span>
        <span className="eyebrow">Surface / System</span>
      </div>
      <Loader />
      <CursorEffect container={menuOpen ? menu.current : null} />
    </TransitionContext.Provider>
  );
}
export function Footer() {
  const pathname = usePathname();
  return (
    <footer className="site-footer">
      <Reveal key={pathname} className="footer-top">
        <span className="eyebrow">An idea deserves both sides.</span>
        <MotionLink href="/contact" className="footer-title">
          LET’S MAKE
          <br />
          <span>IT WORK.</span>
          <span className="footer-arrow" aria-hidden="true">
            ↗
          </span>
        </MotionLink>
      </Reveal>
      <div className="footer-links">
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <div>
          <a href={site.github}>GitHub ↗</a>
          <a href={site.linkedin}>LinkedIn ↗</a>
          <a href={site.twitter}>X ↗</a>
          <a href={site.resume}>Résumé ↗</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Waffiyyi Fashola</span>
        <span>Designed & engineered in Lagos.</span>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
