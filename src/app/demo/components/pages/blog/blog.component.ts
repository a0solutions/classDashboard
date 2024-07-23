import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { urls } from 'src/environments/environment';
import { QuillEditorComponent } from 'ngx-quill';
import { BlogService } from 'src/app/demo/service/blog.service';
interface blog {
    id?: string;
    title: string;
    author: string;
    content: any;
    date: string;
}

@Component({
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
    @ViewChild('editor') editor: QuillEditorComponent;

    formBanner: any;
    formfiles = new FormData();
    url: string = urls.url;
    text: any;
    author: string;
    name = 'Angular';
    blogs: blog[];
    modules = {
        formula: true,
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction
            [{ size: ['small', 'normal', 'large'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
        ],
    };

    constructor(
        private BlogService: BlogService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.blogs = [];
    }
    onEditorCreated(event) {
        this.editor = event;
        console.log(event);
    }
    // uploadBanner(event: any) {
    //     if (event.target.files[0]) {
    //         const fileList: FileList = event.target.files;
    //         for (var i = 0; i <= fileList.length; i++) {
    //             this.formfiles.append('MyBanner[0]', event.target.files[i]);
    //         }
    //         console.log(this.formfiles);
    //     }
    // }

    sendBlog(form: NgForm) {
        this.formfiles.append('name', this.name);
        this.formfiles.append('author', this.author);
        this.formfiles.append('content', this.editor.editorElem.innerHTML);
        this.BlogService.postBlog(this.formfiles).subscribe((x) => {
            console.log(x);
            // form.reset();
            // this.messageService.add({
            //     severity: 'success',
            //     summary: 'Confirmed',
            //     detail: 'The collection was created',
            // });
            // if (!x) {
            //     this.messageService.add({
            //         severity: 'error',
            //         summary: 'Rejected',
            //         detail: 'Max size for files 2MB',
            //     });
            // }
        });
        console.log(form);
        console.log(this.editor.editorElem.innerHTML);
    }
    deleteBlog(id: string) {}
}
