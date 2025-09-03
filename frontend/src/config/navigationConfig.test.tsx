import { describe, it, expect } from "vitest";
import { navItems } from "./navigationConfig";
import {
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
  DollarOutlined,
  ToolOutlined,
  BarChartOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

describe("navItems", () => {
  it("debe tener 8 elementos", () => {
    expect(navItems).toHaveLength(8);
  });

  it("cada elemento debe tener las propiedades requeridas", () => {
    navItems.forEach((item) => {
      expect(item).toHaveProperty("key");
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("i18nKey");
    });
  });

  it("el primer elemento debe ser 'Home'", () => {
    const homeItem = navItems[0];
    expect(homeItem.key).toBe("1");
    expect(homeItem.path).toBe("/");
    expect(homeItem.label).toBe("Home");
    expect(homeItem.i18nKey).toBe("Inicio");
    expect(homeItem.icon).toBeDefined();
  });

  it("el último elemento debe ser 'Buscar'", () => {
    const searchItem = navItems[7];
    expect(searchItem.key).toBe("8");
    expect(searchItem.label).toBe("Buscar");
    expect(searchItem.i18nKey).toBe("Buscar");
    expect(searchItem.icon).toBeDefined();
    expect(searchItem.action).toBe("searchModal");
  });

  it("los elementos protegidos deben tener la propiedad 'protected'", () => {
    const protectedItems = navItems.filter((item) => item.protected);
    expect(protectedItems).toHaveLength(3);
    protectedItems.forEach((item) => {
      expect(item.protected).toBe(true);
    });
  });

  it("los iconos deben ser los esperados", () => {
    expect(navItems[0].icon).toEqual(<HomeOutlined />);
    expect(navItems[1].icon).toEqual(<UnorderedListOutlined />);
    expect(navItems[2].icon).toEqual(<BarChartOutlined />);
    expect(navItems[3].icon).toEqual(<DollarOutlined />);
    expect(navItems[4].icon).toEqual(<ToolOutlined />);
    expect(navItems[5].icon).toEqual(<MailOutlined />);
    expect(navItems[6].icon).toEqual(<FileTextOutlined />);
    expect(navItems[7].icon).toEqual(<SearchOutlined />);
  });
});
