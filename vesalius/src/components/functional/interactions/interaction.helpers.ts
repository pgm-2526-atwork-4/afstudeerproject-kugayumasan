import { COLORS } from "@style/colors";
import type { InteractionStatus } from "@design/interactions/InteractionCard";

export function getStatusColors(status: InteractionStatus) {
  switch (status) {
    case "Voltooid":
      return { bg: COLORS.successBg, text: COLORS.success };

    case "In afwachting":
      return { bg: COLORS.warnBg, text: COLORS.warn };

    case "Verwerking":
      return { bg: COLORS.infoBg, text: COLORS.info };

    case "Fout":
      return { bg: COLORS.errorBg, text: COLORS.error };

    default:
      return { bg: COLORS.background.tint, text: COLORS.text };
  }
}