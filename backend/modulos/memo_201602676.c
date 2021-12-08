//Header obligatorio de todos los modulos
#include <linux/module.h>
//Header para usar KERN_INFO
#include <linux/kernel.h>

//Header para los macros module_init y module_exit
#include <linux/init.h>
//Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>
/* for copy_from_user */
#include <asm/uaccess.h>	
/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Módulo de RAM");
MODULE_AUTHOR("Josselyn Vanessa Polanco Gameros");

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int escribir_archivo(struct seq_file *archivo, void *v)
{   

    seq_printf(archivo, "*********************************************\n");
    seq_printf(archivo, "*********************************************\n");
    seq_printf(archivo, "**    LABORATORIO SISTEMAS OPERATIVOS 1    **\n");
    seq_printf(archivo, "**                Proyecto 1               **\n");
    seq_printf(archivo, "**    JOSSELYN VANESSA POLANCO GAMEROS     **\n");
    seq_printf(archivo, "*********************************************\n");
    seq_printf(archivo, "*********************************************\n");
    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};


//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("memo_201602676", 0, NULL, &operaciones);
    printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Nombre: Josselyn Vanessa Polanco Gameros");
    printk(KERN_INFO "Carnet: 201602676");
    printk(KERN_INFO "Insertando el módulo para información de RAM\n");
    
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("memo_201602676", NULL);
    printk(KERN_INFO "***** Proyecto 1 *****\n");
    printk(KERN_INFO "Curso: SISTEMAS OPERATIVOS I");
    printk(KERN_INFO "Nombre: Josselyn Vanessa Polanco Gameros");
    printk(KERN_INFO "Carnet: 201602676");
    printk(KERN_INFO "Removiendo el módulo para información de RAM\n");
}

module_init(_insert);
module_exit(_remove);