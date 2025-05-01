import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            }}
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            }}
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "h-6 w-6 p-0 hover:bg-sidebar-hover focus-visible:ring-0 focus-visible:ring-offset-0 [&_svg]:h-4 [&_svg]:w-4",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      {children || <PanelLeft />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 flex flex-1 flex-col gap-4 overflow-auto px-4", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center gap-4 px-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarSearch = React.forwardRef(({ className, ...props }, ref) => (
  <div className="px-4">
    <Input
      ref={ref}
      className={cn(
        "h-9 w-full bg-sidebar-muted text-sidebar-foreground placeholder:text-sidebar-foreground/60",
        className
      )}
      placeholder="Search..."
      {...props}
    />
  </div>
))
SidebarSearch.displayName = "SidebarSearch"

const SidebarSection = React.forwardRef(({ className, children, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      data-state={state}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarSection.displayName = "SidebarSection"

const SidebarSectionTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "flex items-center gap-2 px-4 text-xs font-medium text-sidebar-foreground/60",
        "data-[state=collapsed]:justify-center data-[state=collapsed]:px-2",
        className
      )}
      {...props}
    />
  )
})
SidebarSectionTitle.displayName = "SidebarSectionTitle"

const SidebarNav = React.forwardRef(({ className, children, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <nav
      ref={ref}
      data-state={state}
      className={cn(
        "-mx-2 flex flex-1 flex-col gap-1",
        "data-[state=collapsed]:items-center",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
})
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef(
  ({ className, children, icon, tooltip, asChild = false, ...props }, ref) => {
    const { state } = useSidebar()
    const Comp = asChild ? Slot : "button"

    if (state === "collapsed") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Comp
              ref={ref}
              className={cn(
                "group relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-sidebar-hover focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar disabled:pointer-events-none disabled:opacity-50",
                className
              )}
              {...props}
            >
              {icon}
              <span className="sr-only">{tooltip}</span>
            </Comp>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "group relative flex h-9 items-center rounded-md px-3 hover:bg-sidebar-hover focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </Comp>
    )
  }
)
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavItemInner = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex flex-1 items-center justify-between truncate text-sm font-medium",
      className
    )}
    {...props}
  />
))
SidebarNavItemInner.displayName = "SidebarNavItemInner"

const SidebarDivider = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    className={cn("mx-4 bg-sidebar-muted", className)}
    {...props}
  />
))
SidebarDivider.displayName = "SidebarDivider"

const SidebarSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <Skeleton
    ref={ref}
    className={cn("h-9 w-full bg-sidebar-muted", className)}
    {...props}
  />
))
SidebarSkeleton.displayName = "SidebarSkeleton"

export {
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSearch,
  SidebarSection,
  SidebarSectionTitle,
  SidebarNav,
  SidebarNavItem,
  SidebarNavItemInner,
  SidebarDivider,
  SidebarSkeleton,
  SidebarProvider,
} 