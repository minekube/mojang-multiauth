use worker::*;

const NEW_URL_LIST: [&str; 2] = [
    "https://sessionserver.mojang.com/session/minecraft/hasJoined",
    "https://api.minehut.com/mitm/proxy/session/minecraft/hasJoined"
];

#[event(fetch)]
async fn main(req: Request, env: Env, ctx: Context) -> Result<Response> {
    let url = match req.url() {
        Ok(url) => url,
        Err(_) => {
            return Response::error("Unrecognizable path", 404);
        }
    };
    
    if url.path() != "/mitm/session/minecraft/hasJoined" {
        return Response::empty();
    }
    
    println!("{}", url);
    
    
    get_authenticated_user(url, env, ctx)
}

fn get_authenticated_user(url: Url, env: Env, ctx: Context) -> Result<Response> {
    for new_url in NEW_URL_LIST {
        let modified_request = match Request::new("", Method::Get) {
            Ok(request) => request,
            Err(err) => {
                println!("Unable to modify request {url}: {err}");
                return Response::error("", 204);
            }
        };
        // todo
    }
    
    return Response::error("", 204);
}
