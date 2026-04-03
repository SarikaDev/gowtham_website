"use client";

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses Clerk's client-side hooks to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from "react";
// import { useOrganization, useUser } from '@clerk/nextjs';
import type { NavItem, NavGroup } from "@/types";

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  // const { organization, membership } = useOrganization();
  // const { user } = useUser();

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    const permissions = { permissions: "granted-mock" }?.permissions || [];
    const role = { role: "admin" }?.role;

    return {
      user: { id: "sad" },
      permissions: permissions as string[],
      role: role ?? undefined,
    };
  }, []);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // No access restrictions
      if (!item.access) {
        return true;
      }

      // Check requireOrg

      // Check permission
      if (item.access.permission) {
        if (!accessContext) {
          return false;
        }
        if (!accessContext.permissions.includes(item.access.permission)) {
          return false;
        }
      }

      // Check role
      if (item.access.role) {
        if (accessContext.role !== item.access.role) {
          return false;
        }
      }

      return true;
    });
  }, [items, accessContext]);

  return filteredItems;
}

/**
 * Hook to filter navigation groups based on RBAC (fully client-side)
 *
 * @param groups - Array of navigation groups to filter
 * @returns Filtered groups (empty groups are removed)
 */
export function useFilteredNavGroups(groups: NavGroup[]) {
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const filteredItems = useFilteredNavItems(allItems);

  return useMemo(() => {
    const filteredSet = new Set(filteredItems.map((item) => item.title));
    return groups
      .map((group) => ({
        ...group,
        items: filteredItems.filter((item) =>
          group.items.some(
            (gi) => gi.title === item.title && filteredSet.has(gi.title),
          ),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, filteredItems]);
}
