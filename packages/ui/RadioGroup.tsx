// import React from "react";
// import { Dialog as HeadlessDialog } from "@headlessui/react";
// import { withStyles } from "./hoc";
// import { ExtractProps } from "./types";
//
// const styles = {
//   root: "fixed inset-0 z-10 overflow-y-auto",
//   title: "text-lg font-medium leading-6 text-gray-900",
//   description: "text-sm text-gray-500",
//   overlay: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity",
// };
//
// type DialogRoot = (props: ExtractProps<typeof HeadlessDialog>) => JSX.Element;
// type Title = (props: ExtractProps<typeof HeadlessDialog.Title>) => JSX.Element;
// type Description = (
//   props: ExtractProps<typeof HeadlessDialog.Description>
// ) => JSX.Element;
// type Overlay = (
//   props: ExtractProps<typeof HeadlessDialog.Overlay>
// ) => JSX.Element;
// type RadioGroup = DialogRoot & { Title: Title } & {
//   Description: Description;
// } & {
//   Overlay: Overlay;
// };
//
// const DialogRoot: DialogRoot = withStyles(HeadlessDialog, styles.root);
// const Title: Title = withStyles(HeadlessDialog.Title, styles.title);
// const Description: Description = withStyles(
//   HeadlessDialog.Description,
//   styles.description
// );
// const Overlay: Overlay = withStyles(HeadlessDialog.Overlay, styles.overlay);
//
// export let Dialog: RadioGroup = Object.assign(DialogRoot, {
//   Title,
//   Description,
//   Overlay,
// });
