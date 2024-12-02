import { useEffect, useRef } from "react";
import {
  RenderingEngine,
  Enums,
  type Types,
  volumeLoader,
} from "@cornerstonejs/core";
import { init as csRenderInit } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import initDemo from "./initDemo";
import * as cornerstoneTools from '@cornerstonejs/tools'

const {
  PanTool,
  WindowLevelTool,
  StackScrollTool,
  ZoomTool,
  ToolGroupManager,
  Enums: csToolsEnums,
} = cornerstoneTools;

const { MouseBindings } = csToolsEnums;

const toolGroupId = 'myToolGroup';

let viewport

function App() {
  const elementRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return;
      }
      running.current = true;

      await initDemo();
      cornerstoneTools.addTool(PanTool);
      cornerstoneTools.addTool(WindowLevelTool);
      cornerstoneTools.addTool(StackScrollTool);
      cornerstoneTools.addTool(ZoomTool);

      // Define a tool group, which defines how mouse events map to tool commands for
      // Any viewport using the group
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

      // Add tools to the tool group
      toolGroup?.addTool(WindowLevelTool.toolName);
      toolGroup?.addTool(PanTool.toolName);
      toolGroup?.addTool(ZoomTool.toolName);
      toolGroup?.addTool(StackScrollTool.toolName);

      // Set the initial state of the tools, here all tools are active and bound to
      // Different mouse inputs
      toolGroup?.setToolActive(WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Primary, // Left Click
          },
        ],
      });
      toolGroup?.setToolActive(PanTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Auxiliary, // Middle Click
          },
        ],
      });
      toolGroup?.setToolActive(ZoomTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Secondary, // Right Click
          },
        ],
      });
      // As the Stack Scroll mouse wheel is a tool using the `mouseWheelCallback`
      // hook instead of mouse buttons, it does not need to assign any mouse button.
      toolGroup?.setToolActive(StackScrollTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Wheel,
          },
        ],
      });

      // Get Cornerstone imageIds and fetch metadata into RAM

      // Instantiate a rendering engine
      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);
      console.log(elementRef,'8888888888888888')
      // Create a stack viewport
      const viewportId = "CT_STACK";
      const viewportInput = {
        viewportId,
        type: 'stack',
        element: elementRef.current,
      };

      renderingEngine.enableElement(viewportInput);

      // Get the stack viewport that was created
      viewport = renderingEngine.getViewport(
        viewportId
      ) as Types.IVolumeViewport;

      toolGroup?.addViewport(viewportId, renderingEngineId);

    };

    setup();

    // Create a stack viewport
  }, [elementRef, running]);

  const download = () => {
    console.log(viewport, '333333333')
    viewport.setStack(['wadouri:http://localhost:5173/CTImage.dcm_JPEGProcess14TransferSyntax_1.2.840.10008.1.2.4.57.dcm']).then(() => {
    console.log(viewport, '444444444444')

      // Render the image
      console.log(111111111111)
      viewport.render();
    })
  }

  const handleClick = () => {

    download()

  }

  return (
    <>
    <div
      ref={elementRef}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
    <button onClick={() => handleClick()}>haha</button>
    </>
    
  );
}

export default App;
