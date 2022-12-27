import { Get, Controller, ControllerToRouter } from "../src";
import { Request, Response } from "express";
import express from "express";

const app = express();

@Controller({ path: "/example" })
class ExampleController {
    @Get("/test")
    test(req: Request, res: Response) {
        return res
            .status(200)
            .send("Hello World!")
            .end();
    }
}

const router = ControllerToRouter(ExampleController);

app.use(router);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
