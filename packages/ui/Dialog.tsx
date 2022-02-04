import React from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { withStyles } from "./hoc";
import { ExtractProps } from "./types";

const styles = {
  root: "test",
  title: "text-black border border-black",
  description:
    "text-black border border-black font-bold text-xs decoration-slate-50",
  overlay: "",
};

type DialogRoot = (props: ExtractProps<typeof HeadlessDialog>) => JSX.Element;
type Title = (props: ExtractProps<typeof HeadlessDialog.Title>) => JSX.Element;
type Description = (
  props: ExtractProps<typeof HeadlessDialog.Description>
) => JSX.Element;
type Overlay = (
  props: ExtractProps<typeof HeadlessDialog.Overlay>
) => JSX.Element;
type Dialog = DialogRoot & { Title: Title } & { Description: Description } & {
  Overlay: Overlay;
};

const DialogRoot: DialogRoot = withStyles(HeadlessDialog, styles.root);
const Title: Title = withStyles(HeadlessDialog.Title, styles.title);
const Description: Description = withStyles(
  HeadlessDialog.Description,
  styles.description
);
const Overlay: Overlay = withStyles(HeadlessDialog.Overlay, styles.overlay);

export let Dialog: Dialog = Object.assign(DialogRoot, {
  Title,
  Description,
  Overlay,
});
