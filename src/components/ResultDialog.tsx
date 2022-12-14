import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "../stores";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import groovy from "react-syntax-highlighter/dist/esm/languages/hljs/groovy";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

import { transpile_groovy } from "@robinmauritz/autalon-transpiler";

import {
  ArgType,
  FunctionMetadata,
  mappedFnList,
} from "../BuiltinFunctionList";
import { Close, ContentPaste, Launch } from "@mui/icons-material";

import { CopyToClipboard } from "react-copy-to-clipboard";

SyntaxHighlighter.registerLanguage("javascript", groovy);

type ResultDialogProps = {
  open: boolean;
  handleClose: () => void;
};

export default function ResultDialog(props: ResultDialogProps) {
  const commandList = useStore((state) => state.instructionList);
  const [stringifiedCommandList, setStringifiedCommandList] =
    useState<string | null>(null);
  const [convertedCode, setConvertedCode] = useState<string>("");

  useEffect(() => {
    let stringifiedFuncs = commandList.map((x) => {
      const argsMetadata = mappedFnList().find(
        (y: FunctionMetadata) => y.name == x.name
      )?.args!;
      const preprocessedValue = x.argValue.map((x, i) =>
        argsMetadata[i].argType == ArgType.String ? `"${x}"` : x
      );
      return `#:${x.name}(${preprocessedValue.join(", ")});`;
    });
    let stringifiedCmds = stringifiedFuncs.join("\n");

    setStringifiedCommandList(`#[version=1]\n\n${stringifiedCmds}`);
  }, [commandList]);

  useEffect(() => {
    if (stringifiedCommandList == null) return;

    setConvertedCode(transpile_groovy(stringifiedCommandList!));
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        <span>Result Script</span>

        {props.handleClose ? (
          <IconButton
            aria-label="close"
            onClick={props.handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        ) : null}
      </DialogTitle>
      {/* <Code language="groovy">{stringifiedCommandList}</Code> */}
      <DialogContent>
        <SyntaxHighlighter language="groovy" style={docco}>
          {convertedCode}
        </SyntaxHighlighter>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<Launch />}
          href="https://github.com/RoganMatrivski/Autalon-Generator/blob/master/docs/USAGE.md"
          target="_blank"
          sx={{ mx: 2 }}
        >
          How to use
        </Button>
        <CopyToClipboard text={convertedCode} onCopy={() => alert("Copied")}>
          <Button variant="outlined" startIcon={<ContentPaste />}>
            Copy
          </Button>
        </CopyToClipboard>
      </DialogActions>
    </Dialog>
  );
}
