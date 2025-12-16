package org.example.frontdemo.index.controller;

import org.example.frontdemo.index.form.Reqform;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

@Controller
public class indexController {

    // ルートアクセス("/")で templates/index.html を返す
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/test1")
    @ResponseBody
    public ResponseEntity<List<Reqform>> test1(@RequestBody Reqform reqform) {
        return ResponseEntity.ok ( Arrays.asList ( reqform ) );
    }

    @PostMapping("/test2")
    public String test2(
            @RequestParam("testList") String json,
            Model model
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // フロントは配列を送るため、明示的に List<Reqform> 型を指定してデシリアライズ
            List<Reqform> list = objectMapper.readValue(
                    json,
                    new TypeReference<List<Reqform>>() {}
            );
            list.add (new Reqform("山田太郎", "male"));
            model.addAttribute("testList", list);
            return "modelessWindow"; // modelessWindow.html
        } catch (Exception e) {
            // デバッグ用に簡易エラー表示（必要に応じて削除/ログ化）
            model.addAttribute("testList", java.util.Collections.emptyList());
            model.addAttribute("error", e.getMessage());
            return "modelessWindow";
        }
    }
}
