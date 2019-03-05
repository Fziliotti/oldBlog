---
layout: post
comments: true
title: "O simples Gulp"
date: 2018-11-08 06:02:23
image: '/assets/img/'
description: 'O automatizador de tarefas mais simples que conheci até o momento'
main-class: 'dev'
color:
tags: ['dev', 'js', 'frontend']
categories:
twitter_text:
introduction: 'O automatizador de tarefas mais simples que conheci até o momento'
---

# Introdução

O gulp é um kit de ferramentas JavaScript de código aberto da Fractal Innovations e da comunidade de código aberto do GitHub que "ajuda a automatizar tarefas dolorosas ou demoradas em seu fluxo de trabalho de desenvolvimento", definição presente em [Repositório Github do Gulp](https://github.com/gulpjs/gulp)

## O gulp é muito simples e esse template da utilização dele demonstra isso

```js
// O gulp e os plugins são carregados através da função `require` do nodejs
const gulp =   require('gulp');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Definição do diretorio dos arquivos para evitar repetição futuramente
const files = "./src/*.js";

//Aqui criamos uma nova tarefa através do ´gulp.task´ e damos a ela o nome 'lint'
gulp.task('lint', () => {
// Aqui carregamos os arquivos que a gente quer rodar as tarefas com o `gulp.src`
// E logo depois usamos o `pipe` para rodar a tarefa `jshint`
gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Criamos outra tarefa com o nome 'dist'
gulp.task('dist', () => {

// Carregamos os arquivos novamente
// E rodamos uma tarefa para concatenação
// Renomeamos o arquivo que sera minificado e logo depois o minificamos com o `uglify`
// Por fim, usamos o `gulp.dest` para colocar os arquivos concatenados e minificados na pasta build/
gulp.src(files)
    .pipe(concat('./dist'))
    .pipe(rename('dist.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

//Criamos uma tarefa 'default' que vai rodar quando rodamos `gulp` no terminal
gulp.task('default', () => {
    // Usamos o `gulp.run` para rodar as tarefas
    // E usamos o `gulp.watch` para rodar gulp novamente ao encontrar alguma mudança.
    gulp.run('lint', 'dist');
    gulp.watch(files, function(evt) {
        gulp.run('lint', 'dist');
    });
});
```